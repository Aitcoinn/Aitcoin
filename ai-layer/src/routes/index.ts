// ============================================================
// ROUTES/INDEX.TS — Central Router
// v3: Added node info, health, blockchain, admin dashboard
// ============================================================

import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import { instancesRouter, monitorRouter, poolRouter, validateRouter } from "./ai/index.js";
import civilizationLiveRouter from "./civilization-live.js";
import { walletRouter } from "./wallet.js";
import p2pRouter from "./p2p/index.js";
import validatorRouter from "./validator.js";
import reputationRouter from "./reputation.js";
import contributionRouter from "./contribution.js";
import engineRouter from "./engine.js";
import evolutionRouter from "./evolution.js";
import securityRouter from "./security.js";
import developerRouter from "./developer.js";
import nodeRouter from "./node.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(instancesRouter);
router.use(monitorRouter);
router.use(poolRouter);
router.use(validateRouter);
router.use(civilizationLiveRouter);
router.use("/wallet",    walletRouter);
router.use("/",          developerRouter);
router.use("/",          nodeRouter);       // NEW: /node/info, /node/health, /node/blockchain
router.use(p2pRouter);
router.use(validatorRouter);
router.use(reputationRouter);
router.use(contributionRouter);
router.use(engineRouter);
router.use(securityRouter);
router.use(evolutionRouter);

export default router;
