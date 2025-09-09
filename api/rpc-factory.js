// @/api/rpc-factory.js
import { handleApiRequest } from './api-handler';

/**
 * Create a lightweight RPC client for POST-based RPC endpoints
 * Example (payroll):
 *   const payrollRpc = createRpcClient({ basePath: '/api/v1/payroll/rpc', methods: ['preview','run'] });
 *   await payrollRpc.preview({ token, body: { month: '2025-01' } });
 *
 * Example (attendance time clock):
 *   const timeClockRpc = createRpcClient({ basePath: '/api/v1/attendance/time-clock', methods: ['process'] });
 *   await timeClockRpc.process({ token, body: { action: 'check_in' } });
 */
export function createRpcClient({ basePath, methods = [] }) {
  if (!basePath) throw new Error('RPC: basePath is required');

  const client = {};

  methods.forEach((methodName) => {
    client[methodName] = async ({ token, body, options = {} } = {}) => {
      return handleApiRequest('POST', `${basePath}/${methodName}`, {
        token,
        body,
        cache: 'no-store',
        ...options,
      });
    };
  });

  return client;
}

/**
 * Convenience wrapper for module RPCs with consistent pathing
 * Example: createModuleRpc('payroll', 'rpc', ['preview','run']) → /api/v1/payroll/rpc/<method>
 */
export function createModuleRpc(moduleName, subPath, methods = [], { apiBase = '/api/v1' } = {}) {
  const basePath = `${apiBase}/${moduleName}${subPath ? `/${subPath}` : ''}`;
  return createRpcClient({ basePath, methods });
}


