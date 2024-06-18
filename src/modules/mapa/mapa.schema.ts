import { Static, Type } from "@sinclair/typebox";

// ESQUEMAS ÚTILES RELACIONADOS A CONDUCTOR

// ESQUEMA DE OBTENER RUTA
export type GetRutaCalculadaType = Static<typeof GetRutaCalculadaSchemaQuery>;
export type RutaResponseType = Static<typeof RutaResponseSchema>;

const PuntoSchema = Type.Object({
  latitud: Type.Number(),
  longitud: Type.Number(),
});
const GetRutaCalculadaSchemaQuery = Type.Object({
  inicio: PuntoSchema,
  destino: PuntoSchema,
});

const RutaResponseSchema = Type.Object({
  lineaTransporteID: Type.Number(),
  numeroLinea: Type.String(),
  puntos: Type.Array(PuntoSchema),
});
const GetRutaCalculadaSchemaResponse = Type.Object({
  list: Type.Array(RutaResponseSchema),
});

export const GetRutaCalculadaSchema = {
  body: GetRutaCalculadaSchemaQuery,
  response: {
    200: GetRutaCalculadaSchemaResponse,
  },
};
