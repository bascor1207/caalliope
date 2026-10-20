import type { AnalyticsSink } from "../application/ports";
import { InMemoryAnalyticsSink } from "./in-memory-sink";

export const analyticsSink: AnalyticsSink = new InMemoryAnalyticsSink();
