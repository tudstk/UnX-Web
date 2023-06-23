window.onload = function () {
  SwaggerUIBundle({
    url: "../api/utils/swagger.json", // Replace with the path to your Swagger JSON file
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: "StandaloneLayout",
  });
};
