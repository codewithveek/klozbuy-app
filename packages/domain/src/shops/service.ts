import type {
  CreateShopWithLocationInput,
  MyShop,
  RecordVisitInput,
  ShopHours,
  ShopLocationInput,
  ShopPublic,
  UpdateShopInput,
} from '@klozbuy/contracts';
import type { DbExecutor } from '@klozbuy/db';
import { createId, err, formatDays, ok } from '@klozbuy/shared';
import { cellsForPoint } from '@klozbuy/shared/geo';
import type { Ctx } from '../context';
import { forbidden, notFound, requireActor, type DomainResult } from '../errors';
import { findPlaces, nearestArea } from '../places';
import { uniqueSlug } from '../slugs';
import { toMyShop, toShopPublic } from './mappers';
import { areaNameOf } from './snapshots';
import * as repo from './repository';

const hoursValues = (hours: ShopHours | undefined) =>
  hours
    ? { opensAt: hours.opensAt, closesAt: hours.closesAt, openDays: formatDays(hours.openDays) }
    : {};

/** The location row, labelled with the nearest neighbourhood when none was chosen. */
async function locationValues(db: DbExecutor, shopId: string, input: ShopLocationInput) {
  const { h3r7, h3r8 } = cellsForPoint(input);
  const areaId = input.areaId ?? nearestArea(await findPlaces(db), input)?.id ?? null;
  return {
    id: createId(),
    shopId,
    lat: input.lat,
    lng: input.lng,
    h3r7,
    h3r8,
    landmark: input.landmark,
    address: input.address ?? null,
    areaId,
  };
}

/** Opens a shop with its location. The owner can list items straight away. */
export async function createShop(
  ctx: Ctx,
  input: CreateShopWithLocationInput,
): Promise<DomainResult<MyShop>> {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  const id = createId();
  const slug = await uniqueSlug(input.name, (s) => repo.shopSlugTaken(ctx.db, s));
  const location = await locationValues(ctx.db, id, input.location);
  await ctx.db.transaction(async (tx) => {
    await repo.insertShop(tx, {
      id,
      ownerId: actor.value.userId,
      slug,
      name: input.name,
      categoryId: input.categoryId,
      description: input.description ?? null,
      whatsappNumber: input.whatsappNumber,
      ...hoursValues(input.hours),
    });
    await repo.replacePrimaryLocation(tx, location);
  });
  await ctx.publish([{ type: 'ShopChanged', shopId: id }]);
  return getMyShop(ctx, id);
}

/** Loads a shop the actor owns, or explains why not. Other modules use this for permission checks. */
export async function requireShopOwner(
  ctx: Ctx,
  shopId: string,
): Promise<DomainResult<repo.ShopRow>> {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  const shop = await repo.findShopById(ctx.db, shopId);
  if (!shop) return err(notFound('SHOP_NOT_FOUND', 'That shop'));
  if (shop.ownerId !== actor.value.userId && actor.value.role !== 'admin') {
    return err({ code: 'NOT_SHOP_OWNER', message: 'Only the shop owner can do this' });
  }
  return ok(shop);
}

export async function getMyShop(ctx: Ctx, shopId: string): Promise<DomainResult<MyShop>> {
  const shop = await requireShopOwner(ctx, shopId);
  if (!shop.ok) return shop;
  const location = await repo.findPrimaryLocation(ctx.db, shopId);
  return ok(toMyShop(shop.value, location, await areaNameOf(ctx.db, location)));
}

export async function listMyShops(ctx: Ctx): Promise<DomainResult<MyShop[]>> {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  const shops = await repo.findShopsByOwner(ctx.db, actor.value.userId);
  const locations = await Promise.all(shops.map((s) => repo.findPrimaryLocation(ctx.db, s.id)));
  const names = await Promise.all(locations.map((l) => areaNameOf(ctx.db, l)));
  return ok(shops.map((shop, i) => toMyShop(shop, locations[i] ?? null, names[i] ?? null)));
}

/** The public shop page. Suspended shops are hidden. */
export async function getShopPage(ctx: Ctx, slug: string): Promise<DomainResult<ShopPublic>> {
  const shop = await repo.findShopBySlug(ctx.db, slug);
  if (!shop || shop.verificationStatus === 'suspended')
    return err(notFound('SHOP_NOT_FOUND', 'That shop'));
  const location = await repo.findPrimaryLocation(ctx.db, shop.id);
  return ok(toShopPublic(shop, location, await areaNameOf(ctx.db, location)));
}

export async function updateShopLocation(
  ctx: Ctx,
  shopId: string,
  input: ShopLocationInput,
): Promise<DomainResult<MyShop>> {
  const shop = await requireShopOwner(ctx, shopId);
  if (!shop.ok) return shop;
  await repo.replacePrimaryLocation(ctx.db, await locationValues(ctx.db, shopId, input));
  await ctx.publish([{ type: 'ShopChanged', shopId }]);
  return getMyShop(ctx, shopId);
}

/** Name, description, WhatsApp number or opening hours. */
export async function updateShop(
  ctx: Ctx,
  shopId: string,
  input: UpdateShopInput,
): Promise<DomainResult<MyShop>> {
  const shop = await requireShopOwner(ctx, shopId);
  if (!shop.ok) return shop;
  const { hours, ...fields } = input;
  await repo.updateShopRow(ctx.db, shopId, { ...fields, ...hoursValues(hours) });
  await ctx.publish([{ type: 'ShopChanged', shopId }]);
  return getMyShop(ctx, shopId);
}

/** A field agent records a visit; a passed visit verifies the shop. */
export async function recordVisit(
  ctx: Ctx,
  shopId: string,
  input: RecordVisitInput,
): Promise<DomainResult<ShopPublic>> {
  const actor = requireActor(ctx);
  if (!actor.ok) return actor;
  if (actor.value.role !== 'agent' && actor.value.role !== 'admin')
    return err(forbidden('Only field agents record visits'));
  const shop = await repo.findShopById(ctx.db, shopId);
  if (!shop) return err(notFound('SHOP_NOT_FOUND', 'That shop'));
  const now = ctx.clock.now();
  await repo.insertVisit(ctx.db, {
    id: createId(),
    shopId,
    agentId: actor.value.userId,
    visitedAt: now,
    result: input.result,
    notes: input.notes ?? null,
  });
  if (input.result === 'passed') {
    await repo.updateVerification(ctx.db, shopId, {
      verificationStatus: 'verified',
      verifiedAt: now,
    });
    await ctx.publish([{ type: 'ShopChanged', shopId }]);
  }
  return getShopPage(ctx, shop.slug);
}
