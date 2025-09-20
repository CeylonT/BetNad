import { PrivyClient } from "@privy-io/server-auth";
import env from "../config/env";

const { privy } = env;

// Initialize Privy client with your API key
export const privyClient = new PrivyClient(privy.appId, privy.appSecret);
