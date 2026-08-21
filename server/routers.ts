import { COOKIE_NAME } from "@shared/const";
import { createClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createCloudinaryUploadSignature } from "./cloudinary";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  media: router({
    createUploadSignature: publicProcedure
      .input(z.object({ schoolId: z.string().uuid(), kind: z.enum(["student-photo", "school-logo", "user-avatar"]) }))
      .mutation(async ({ ctx, input }) => {
        const token = ctx.req.headers.authorization?.replace(/^Bearer\s+/i, "");
        const url = "https://ljvnnpwwmhzdctvflsxb.supabase.co";
        const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!token || !publishableKey || !cloudName || !apiKey || !apiSecret) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Session média non disponible" });
        }

        const supabase = createClient(url, publishableKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
        });
        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (userError || !userData.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Session Supabase invalide" });

        const { data: membership, error: membershipError } = await supabase
          .from("school_memberships")
          .select("school_id")
          .eq("school_id", input.schoolId)
          .eq("user_id", userData.user.id)
          .maybeSingle();
        if (membershipError || !membership) throw new TRPCError({ code: "FORBIDDEN", message: "Accès média refusé" });

        const folder = `schooly/${input.schoolId}/${input.kind}`;
        const signature = createCloudinaryUploadSignature(folder, apiSecret);
        return {
          apiKey,
          cloudName,
          endpoint: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          ...signature,
        };
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
