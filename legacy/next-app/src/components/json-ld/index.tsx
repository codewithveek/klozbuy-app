import React, { createContext, useContext, ReactNode, useMemo } from "react";

// Base types for JSON-LD
interface JSONLDBase {
  "@context"?: string;
  "@type": string;
  "@id"?: string;
}

// Schema.org context
const SCHEMA_CONTEXT = "https://schema.org/";

// Context for managing JSON-LD data collection
interface JSONLDContextType {
  addData: (data: any) => void;
  collectData: () => any;
  parentType?: string;
}

const JSONLDContext = createContext<JSONLDContextType | null>(null);

// Validation utilities
class ValidationError extends Error {
  constructor(
    message: string,
    public component: string,
    public parentType?: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// Component registry for validation
const ComponentRegistry = {
  allowedChildren: {
    Product: [
      "AggregateRating",
      "Review",
      "Brand",
      "Manufacturer",
      "Offer",
      "GenericCollection",
    ],
    Organization: ["Address", "ContactPoint", "Review", "AggregateRating"],
    Person: ["Address", "ContactPoint"],
    Review: ["Author", "Rating", "Location"],
    Article: ["Author", "Publisher", "Review", "AggregateRating"],
    Recipe: ["Author", "NutritionInformation", "Review", "AggregateRating"],
    Event: ["Location", "Organizer", "Performer", "Offer"],
    LocalBusiness: [
      "Address",
      "ContactPoint",
      "Review",
      "AggregateRating",
      "OpeningHours",
    ],
    GenericCollection: ["Review", "Article", "Product", "Event"], // Dynamic collection
  } as Record<string, string[]>,

  validateNesting: (parentType: string, childType: string): boolean => {
    const allowed = ComponentRegistry.allowedChildren[parentType];
    return allowed ? allowed.includes(childType) : true; // Allow unknown parents
  },
};

// Hook for JSON-LD context
const useJSONLD = () => {
  const context = useContext(JSONLDContext);
  if (!context) {
    throw new Error("JSON-LD components must be used within a JSONLD provider");
  }
  return context;
};

// Validation hook
const useValidation = (componentType: string) => {
  const { parentType } = useJSONLD();

  useMemo(() => {
    if (
      parentType &&
      !ComponentRegistry.validateNesting(parentType, componentType)
    ) {
      console.error(
        `Validation Error: ${componentType} cannot be nested inside ${parentType}. ` +
          `Allowed children for ${parentType}: ${
            ComponentRegistry.allowedChildren[parentType]?.join(", ") || "none"
          }`
      );
    }
  }, [parentType, componentType]);
};

// Base component interface
interface BaseComponentProps {
  children?: ReactNode;
  id?: string;
}

// Utility function to create context provider
const createJSONLDProvider = (type: string, data: any, children: ReactNode) => {
  const childData: any[] = [];

  const contextValue: JSONLDContextType = {
    addData: (childData: any) => {
      childData.push(childData);
    },
    collectData: () => childData,
    parentType: type,
  };

  return (
    <JSONLDContext.Provider value={contextValue}>
      {children}
    </JSONLDContext.Provider>
  );
};

// Generic Collection Component
interface GenericCollectionProps extends BaseComponentProps {
  type: "review" | "article" | "product" | "event" | string;
}

export const GenericCollection: React.FC<GenericCollectionProps> = ({
  type,
  children,
}) => {
  useValidation("GenericCollection");
  const { addData } = useJSONLD();

  const collectedData: any[] = [];

  const contextValue: JSONLDContextType = {
    addData: (data: any) => collectedData.push(data),
    collectData: () => collectedData,
    parentType: "GenericCollection",
  };

  // Add collection data to parent
  React.useEffect(() => {
    if (collectedData.length > 0) {
      addData({ [type]: collectedData });
    }
  }, [collectedData.length, type, addData]);

  return (
    <JSONLDContext.Provider value={contextValue}>
      {children}
    </JSONLDContext.Provider>
  );
};

// Product Component
interface ProductProps extends BaseComponentProps {
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  url?: string;
  image?: string | string[];
}

export const Product: React.FC<ProductProps> = ({
  name,
  description,
  brand,
  model,
  sku,
  gtin,
  mpn,
  url,
  image,
  children,
}) => {
  useValidation("Product");
  const { addData } = useJSONLD();

  const childData: any[] = [];
  const contextValue: JSONLDContextType = {
    addData: (data: any) => childData.push(data),
    collectData: () => childData,
    parentType: "Product",
  };

  const productData: any = {
    "@type": "Product",
    name,
    ...(description && { description }),
    ...(brand && { brand }),
    ...(model && { model }),
    ...(sku && { sku }),
    ...(gtin && { gtin }),
    ...(mpn && { mpn }),
    ...(url && { url }),
    ...(image && { image }),
  };

  React.useEffect(() => {
    // Merge child data into product
    childData.forEach((child) => {
      Object.assign(productData, child);
    });
    addData(productData);
  }, [childData.length]);

  return (
    <JSONLDContext.Provider value={contextValue}>
      {children}
    </JSONLDContext.Provider>
  );
};

// AggregateRating Component
interface AggregateRatingProps extends BaseComponentProps {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export const AggregateRating: React.FC<AggregateRatingProps> = ({
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
}) => {
  useValidation("AggregateRating");
  const { addData } = useJSONLD();

  React.useEffect(() => {
    addData({
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue,
        reviewCount,
        bestRating,
        worstRating,
      },
    });
  }, [ratingValue, reviewCount, bestRating, worstRating, addData]);

  return null;
};

// Review Component
interface ReviewProps extends BaseComponentProps {
  name: string;
  reviewBody: string;
  datePublished: string;
  dateModified?: string;
}

export const Review: React.FC<ReviewProps> = ({
  name,
  reviewBody,
  datePublished,
  dateModified,
  children,
}) => {
  useValidation("Review");
  const { addData } = useJSONLD();

  const childData: any[] = [];
  const contextValue: JSONLDContextType = {
    addData: (data: any) => childData.push(data),
    collectData: () => childData,
    parentType: "Review",
  };

  React.useEffect(() => {
    const reviewData: any = {
      "@type": "Review",
      name,
      reviewBody,
      datePublished,
      ...(dateModified && { dateModified }),
    };

    // Merge child data
    childData.forEach((child) => {
      Object.assign(reviewData, child);
    });

    addData(reviewData);
  }, [
    name,
    reviewBody,
    datePublished,
    dateModified,
    childData.length,
    addData,
  ]);

  return (
    <JSONLDContext.Provider value={contextValue}>
      {children}
    </JSONLDContext.Provider>
  );
};

// Author Component
interface AuthorProps extends BaseComponentProps {
  name: string;
  email?: string;
  url?: string;
}

export const Author: React.FC<AuthorProps> = ({ name, email, url }) => {
  useValidation("Author");
  const { addData } = useJSONLD();

  React.useEffect(() => {
    addData({
      author: {
        "@type": "Person",
        name,
        ...(email && { email }),
        ...(url && { url }),
      },
    });
  }, [name, email, url, addData]);

  return null;
};

// Location Component
interface LocationProps extends BaseComponentProps {
  name: string;
  address?: string;
}

export const Location: React.FC<LocationProps> = ({ name, address }) => {
  useValidation("Location");
  const { addData } = useJSONLD();

  React.useEffect(() => {
    addData({
      locationCreated: {
        "@type": "AdministrativeArea",
        name,
        ...(address && { address }),
      },
    });
  }, [name, address, addData]);

  return null;
};

// Rating Component
interface RatingProps extends BaseComponentProps {
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
}

export const Rating: React.FC<RatingProps> = ({
  ratingValue,
  bestRating = 5,
  worstRating = 1,
}) => {
  useValidation("Rating");
  const { addData } = useJSONLD();

  React.useEffect(() => {
    addData({
      reviewRating: {
        "@type": "Rating",
        ratingValue,
        bestRating,
        worstRating,
      },
    });
  }, [ratingValue, bestRating, worstRating, addData]);

  return null;
};

// Organization Component
interface OrganizationProps extends BaseComponentProps {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  foundingDate?: string;
}

export const Organization: React.FC<OrganizationProps> = ({
  name,
  url,
  logo,
  description,
  foundingDate,
  children,
}) => {
  useValidation("Organization");
  const { addData } = useJSONLD();

  const childData: any[] = [];
  const contextValue: JSONLDContextType = {
    addData: (data: any) => childData.push(data),
    collectData: () => childData,
    parentType: "Organization",
  };

  React.useEffect(() => {
    const orgData: any = {
      "@type": "Organization",
      name,
      ...(url && { url }),
      ...(logo && { logo }),
      ...(description && { description }),
      ...(foundingDate && { foundingDate }),
    };

    childData.forEach((child) => {
      Object.assign(orgData, child);
    });

    addData(orgData);
  }, [name, url, logo, description, foundingDate, childData.length, addData]);

  return (
    <JSONLDContext.Provider value={contextValue}>
      {children}
    </JSONLDContext.Provider>
  );
};

// Person Component
interface PersonProps extends BaseComponentProps {
  name: string;
  email?: string;
  telephone?: string;
  jobTitle?: string;
  url?: string;
}

export const Person: React.FC<PersonProps> = ({
  name,
  email,
  telephone,
  jobTitle,
  url,
  children,
}) => {
  useValidation("Person");
  const { addData } = useJSONLD();

  const childData: any[] = [];
  const contextValue: JSONLDContextType = {
    addData: (data: any) => childData.push(data),
    collectData: () => childData,
    parentType: "Person",
  };

  React.useEffect(() => {
    const personData: any = {
      "@type": "Person",
      name,
      ...(email && { email }),
      ...(telephone && { telephone }),
      ...(jobTitle && { jobTitle }),
      ...(url && { url }),
    };

    childData.forEach((child) => {
      Object.assign(personData, child);
    });

    addData(personData);
  }, [name, email, telephone, jobTitle, url, childData.length, addData]);

  return (
    <JSONLDContext.Provider value={contextValue}>
      {children}
    </JSONLDContext.Provider>
  );
};

// Address Component
interface AddressProps extends BaseComponentProps {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export const Address: React.FC<AddressProps> = ({
  streetAddress,
  addressLocality,
  addressRegion,
  postalCode,
  addressCountry,
}) => {
  useValidation("Address");
  const { addData } = useJSONLD();

  React.useEffect(() => {
    addData({
      address: {
        "@type": "PostalAddress",
        streetAddress,
        addressLocality,
        addressRegion,
        postalCode,
        addressCountry,
      },
    });
  }, [
    streetAddress,
    addressLocality,
    addressRegion,
    postalCode,
    addressCountry,
    addData,
  ]);

  return null;
};

// Main JSONLD Component
interface JSONLDProps {
  children: ReactNode;
  dangerouslySetInnerHTML?: boolean;
  context?: string;
}

export const JSONLD: React.FC<JSONLDProps> = ({
  children,
  dangerouslySetInnerHTML = true,
  context = SCHEMA_CONTEXT,
}) => {
  const [jsonLDData, setJsonLDData] = React.useState<any>({});

  const contextValue: JSONLDContextType = {
    addData: (data: any) => {
      setJsonLDData((prev:any) => ({ ...prev, ...data }));
    },
    collectData: () => jsonLDData,
    parentType: undefined,
  };

  const finalData = {
    "@context": context,
    ...jsonLDData,
  };

  const jsonString = JSON.stringify(finalData, null, 2);

  if (dangerouslySetInnerHTML) {
    return (
      <>
        <JSONLDContext.Provider value={contextValue}>
          {children}
        </JSONLDContext.Provider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonString }}
        />
      </>
    );
  }

  return (
    <>
      <JSONLDContext.Provider value={contextValue}>
        {children}
      </JSONLDContext.Provider>
      <script type="application/ld+json">{jsonString}</script>
    </>
  );
};

// Demo Component
const Demo: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        JSON-LD Schema Components Demo
      </h1>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Product with Reviews Example
        </h2>
        <JSONLD>
          <Product
            name="Amazing Widget"
            description="The best widget you'll ever use"
          >
            <AggregateRating ratingValue={4.3} reviewCount={197} />
            <GenericCollection type="review">
              <Review
                name="It's awesome"
                reviewBody="This is Great! My family loves it"
                datePublished="2023-11-22"
              >
                <Author name="Jerry" />
                <Location name="Chicago, IL" />
                <Rating ratingValue={5} />
              </Review>
              <Review
                name="Very cool"
                reviewBody="I like this a lot. Very cool product"
                datePublished="2023-11-22"
              >
                <Author name="Cool Carl" />
                <Location name="Chicago, IL" />
                <Rating ratingValue={4} />
              </Review>
            </GenericCollection>
          </Product>
        </JSONLD>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">Organization Example</h2>
        <JSONLD>
          <Organization
            name="Acme Corp"
            url="https://acme.com"
            description="Leading technology company"
          >
            <Address
              streetAddress="123 Main St"
              addressLocality="New York"
              addressRegion="NY"
              postalCode="10001"
              addressCountry="US"
            />
          </Organization>
        </JSONLD>
      </div>

      <div className="bg-red-100 border border-red-300 p-4 rounded">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Validation Example
        </h3>
        <p className="text-red-700 mb-2">
          Try uncommenting the code below to see validation errors in the
          console:
        </p>
        <pre className="text-sm text-red-600">
          {`// This will show validation errors:
// <JSONLD>
//   <Product name="Test">
//     <Address streetAddress="..." /> {/* Invalid nesting */}
//   </Product>
// </JSONLD>`}
        </pre>
      </div>
    </div>
  );
};

export default Demo;
