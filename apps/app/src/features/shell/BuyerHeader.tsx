import { createStyles, KlozButton, KlozView } from '@klozbuy/ui';
import { SearchForm } from '../discovery/SearchForm';
import { AccountButtons } from '../identity/AccountButtons';
import { LocationButton } from '../location/LocationButton';
import { Wordmark } from './Wordmark';

export const useBarStyles = createStyles((t) => ({
  bar: {
    backgroundColor: t.colors.bgSurface,
    borderBottomWidth: t.stroke.hairline,
    borderBottomColor: t.colors.borderDefault,
    zIndex: 30,
  },
  inner: {
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
    paddingVertical: t.spacing[3] + 2,
    columnGap: t.spacing[5],
    rowGap: t.spacing[3] + 2,
  },
  search: { flexGrow: 1, flexShrink: 1, flexBasis: 360 },
  end: { marginLeft: 'auto' },
  phone: { paddingTop: t.spacing[3] + 2, paddingBottom: t.spacing[3], gap: t.spacing[3] },
}));

/** Desktop and tablet: logo, location, search and the main actions in one wrapping row. */
function WideHeader() {
  const styles = useBarStyles();
  return (
    <KlozView row wrap align="center" style={styles.inner} responsive="gutter">
      <Wordmark />
      <LocationButton />
      <KlozView style={styles.search}>
        <SearchForm />
      </KlozView>
      <KlozView as="nav" row align="center" gap={2}>
        <KlozButton variant="brand-outline" shape="pill" href="/requests">
          Post a request
        </KlozButton>
        <KlozButton shape="pill" href="/sell">
          Sell on Klozbuy
        </KlozButton>
        <AccountButtons />
      </KlozView>
    </KlozView>
  );
}

/** Phones: where you are and the bell, with the search pill underneath. */
function PhoneHeader() {
  const styles = useBarStyles();
  return (
    <KlozView style={styles.phone} px={4}>
      <KlozView row align="center" justify="between" gap={3}>
        <LocationButton variant="phone" />
        <AccountButtons />
      </KlozView>
      <SearchForm compact />
    </KlozView>
  );
}

export function BuyerHeader() {
  const styles = useBarStyles();
  return (
    <KlozView as="header" style={styles.bar}>
      <KlozView responsive="show-from-md">
        <WideHeader />
      </KlozView>
      <KlozView responsive="show-below-md">
        <PhoneHeader />
      </KlozView>
    </KlozView>
  );
}
