import React from "react";
import { sanitizeJsonLd } from "@/lib/seo/structured-data";

export interface JsonLdProps {
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ schema }) => {
  const schemas = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(s) }}
        />
      ))}
    </>
  );
};
