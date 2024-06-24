import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// PERMISOS
/*
- Administrador            111
- Administrador de línea   010
- Conductor                001
- Usuario                  000

*/
export const usuario = pgTable("usuario", {
  usuarioID: serial("usuarioID").primaryKey(),
  nombre: varchar("nombre", { length: 256 }).notNull(),
  password: varchar("password", { length: 128 }).notNull(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  permisos: varchar("permisos", { length: 16 }).notNull().default("111"),
  verificado: boolean("verificado").notNull().default(false),
  creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const lineaTransporte = pgTable("lineaTransporte", {
  lineaTransporteID: serial("lineaTransporteID").primaryKey().notNull(),
  numeroLinea: varchar("numeroLinea", { length: 30 }).notNull().unique(),
  rutaIdaID: integer("rutaIdaID")
    .notNull()
    .references(() => ruta.rutaID),
  rutaVueltaID: integer("rutaVueltaID")
    .notNull()
    .references(() => ruta.rutaID),
  creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  administradorID: integer("administradorID").references(
    () => usuario.usuarioID,
    {
      onDelete: "set null",
    }
  ),
});

export const vehiculo = pgTable("vehiculo", {
  vehiculoID: serial("vehiculoID").primaryKey().notNull(),
  matricula: varchar("matricula", { length: 32 }).notNull(),
  modelo: varchar("modelo", { length: 128 }).notNull(),
  aireAcondicionado: boolean("aireAcondicionado").notNull(),
  propietarioNombre: varchar("propietarioNombre", { length: 128 }).notNull(),
  activo: boolean("activo").notNull().default(false),
  ultimoViaje: timestamp("ultimoViaje", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  latitud: doublePrecision("latitud"),
  longitud: doublePrecision("longitud"),
  creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  lineaTransporteID: integer("lineaTransporteID")
    .notNull()
    .references(() => lineaTransporte.lineaTransporteID, {
      onDelete: "cascade",
    }),
});

export const ruta = pgTable("ruta", {
  rutaID: serial("rutaID").primaryKey().notNull(),
});

export const puntoRuta = pgTable("puntoRuta", {
  puntoRutaID: serial("puntoRutaID").primaryKey().notNull(),
  latitud: doublePrecision("latitud").notNull(),
  longitud: doublePrecision("longitud").notNull(),
  rutaID: integer("rutaID")
    .notNull()
    .references(() => ruta.rutaID, {
      onDelete: "cascade",
    }),
});

export const vehiculoConductor = pgTable(
  "vehiculoConductor",
  {
    usuarioID: integer("usuarioID")
      .notNull()
      .references(() => usuario.usuarioID, {
        onDelete: "cascade",
      }),
    vehiculoID: integer("vehiculoID")
      .notNull()
      .references(() => vehiculo.vehiculoID, {
        onDelete: "cascade",
      }),
    creadoEn: timestamp("creadoEn", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    pkReacciones: primaryKey({
      columns: [t.usuarioID, t.vehiculoID],
    }),
  })
);

export const vehiculoConductorRelaciones = relations(
  vehiculoConductor,
  ({ one }) => ({
    conductor: one(usuario, {
      fields: [vehiculoConductor.usuarioID],
      references: [usuario.usuarioID],
    }),
    vehiculo: one(vehiculo, {
      fields: [vehiculoConductor.vehiculoID],
      references: [vehiculo.vehiculoID],
    }),
  })
);

export const usuarioRelaciones = relations(usuario, ({ many }) => ({
  vehiculos: many(vehiculoConductor),
}));

export const lineaTransporteRelaciones = relations(
  lineaTransporte,
  ({ one, many }) => ({
    administrador: one(usuario, {
      fields: [lineaTransporte.administradorID],
      references: [usuario.usuarioID],
    }),
    rutaIda: one(ruta, {
      fields: [lineaTransporte.rutaIdaID],
      references: [ruta.rutaID],
    }),
    rutaVuelta: one(ruta, {
      fields: [lineaTransporte.rutaVueltaID],
      references: [ruta.rutaID],
    }),
    vehiculos: many(vehiculo),
  })
);

export const vehiculoRelaciones = relations(vehiculo, ({ one }) => ({
  lineaTransporte: one(lineaTransporte, {
    fields: [vehiculo.lineaTransporteID],
    references: [lineaTransporte.lineaTransporteID],
  }),
}));

export const rutaRelaciones = relations(ruta, ({ many }) => ({
  puntos: many(puntoRuta),
}));

export const puntoRutaRelaciones = relations(puntoRuta, ({ one }) => ({
  ruta: one(ruta, {
    fields: [puntoRuta.rutaID],
    references: [ruta.rutaID],
  }),
}));

// export const vehiculoLineaTransporteRelaciones = relations(
//   vehiculoLineaTransporte,
//   ({ one }) => ({
//     vehiculo: one(vehiculo, {
//       fields: [vehiculoLineaTransporte.vehiculoID],
//       references: [vehiculo.vehiculoID],
//     }),
//     user: one(lineaTransporte, {
//       fields: [vehiculoLineaTransporte.lineaTransporteID],
//       references: [lineaTransporte.lineaTransporteID],
//     }),
//   })
// );
