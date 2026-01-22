import { Router } from 'express';
import businessCasesRouter from './businessCases';
import scenariosRouter from './scenarios';
import risksRouter from './risks';
import exportsRouter from './exports';
import authRouter from './auth';

const router = Router();

// Mount routes
router.use('/business-cases', businessCasesRouter);
router.use('/business-cases', scenariosRouter);
router.use('/business-cases', risksRouter);
router.use('/business-cases', exportsRouter);
router.use('/exports', exportsRouter);
router.use('/auth', authRouter);

export default router;
