import z from "zod";

export const createTourTypeZodSchema = z.object({
    name: z.string(),
});

export const updateTourTypeZodSchema = z.object({
    name: z.string(),
});