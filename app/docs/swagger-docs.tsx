"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const swaggerUrl = "/api/openapi";

export default function SwaggerDocs() {
  return (
    <main className="min-h-screen bg-white">
      <SwaggerUI url={swaggerUrl} />
    </main>
  );
}
