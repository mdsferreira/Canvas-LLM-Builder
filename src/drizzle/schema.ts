import { relations } from 'drizzle-orm';
import { pgTable, text, uuid, json, jsonb } from 'drizzle-orm/pg-core';

export const agents = pgTable('agents', {
    id: uuid('id').primaryKey().defaultRandom(),
    globalPrompt: text('global_prompt').notNull(),
});

export const states = pgTable('states', {
    id: uuid('id').primaryKey().defaultRandom(),
    agentId: uuid('agent_id').notNull().references(() => agents.id),
    prompt: text('prompt').notNull(),
    name: text('name').notNull(),
    position: json('position').notNull(), // { x: number, y: number }
});

export const edges = pgTable('edges', {
    id: uuid('id').primaryKey().defaultRandom(),
    agentId: uuid('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
    source: text('source').notNull(),
    target: text('target').notNull(),
    label: text('label').notNull(),
    keywords: jsonb('keywords').$type<string[]>().notNull(),
});

export const agentRelations = relations(agents, ({ many }) => ({
    states: many(states),
    edges: many(edges),
}));

export const stateRelations = relations(states, ({ one }) => ({
    agent: one(agents, {
        fields: [states.agentId],
        references: [agents.id],
    }),
}));


