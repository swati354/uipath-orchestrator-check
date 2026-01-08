# Usage

## ⚠️ CRITICAL: UiPath SDK Type Definitions
**ALWAYS refer to the official UiPath TypeScript SDK type definitions when working with any UiPath data.**

### Type Reference Rules
1. **NEVER guess property names** - Always check the SDK types
2. **Use exact property names** from the SDK type definitions
3. **Import types** from `uipath-sdk` for type safety

### SDK Type Reference
**📖 COMPLETE TYPE DEFINITIONS: See `UIPATH_SDK_TYPES.md` in the project root**

This file contains the OFFICIAL UiPath TypeScript SDK type definitions with:
- All interface and enum definitions
- Common property name mistakes and corrections
- Complete response type structures
- Usage examples

Key type categories:
- **Processes**: `ProcessGetResponse`, `ProcessStartRequest`, `ProcessStartResponse`
- **Tasks**: `RawTaskGetResponse`, `TaskCreateOptions`, `TaskStatus`, `TaskPriority`
- **Queues**: `QueueGetResponse`
- **Assets**: `AssetGetResponse`, `AssetValueType`
- **Maestro**: `RawMaestroProcessGetAllResponse`, `RawProcessInstanceGetResponse`, `RawCaseInstanceGetResponse`
- **Entities**: `RawEntityGetResponse`, `EntityRecord`, `FieldMetaData`
- **Buckets**: `BucketGetResponse`, `BucketGetFileMetaDataResponse`
- **Errors**: All error types extend `UiPathError`

### Always Import Types
```typescript
import type {
  ProcessGetResponse,
  RawTaskGetResponse,
  QueueGetResponse,
  AssetGetResponse
} from 'uipath-sdk';

// Then use them for type safety
const process: ProcessGetResponse = await uipath.processes.getById(123);
console.log(process.processVersion); // ✅ Correct
console.log(process.version); // ❌ TypeScript error - property doesn't exist
```

## ⚠️ CRITICAL: Using Pre-built Hooks - NEVER MOCK DATA
**This template provides React Query hooks that call the UiPath SDK directly. You MUST use these hooks and NEVER mock data.**

### Absolute Rules:
1. **NEVER create mock data** - All data MUST come from real UiPath SDK calls
2. **NEVER use placeholder/fake data** - Even during development, use real API calls
3. **NEVER create dummy/sample data objects** - Let the hooks fetch real data
4. **ALWAYS use the provided hooks** - They handle all UiPath API interactions

❌ **NEVER DO THIS:**
```typescript
// ❌ NO mock data
const mockProcesses = [
  { id: 1, name: 'Sample Process', status: 'Running' }
];

// ❌ NO fetch calls
const response = await fetch('/api/uipath/processes');

// ❌ NO hardcoded placeholder data
const [processes, setProcesses] = useState([
  { name: 'Demo Process', key: 'demo-key' }
]);
```

✅ **ALWAYS DO THIS:**
```typescript
// ✅ Use the provided hooks with auth context
import { useUiPathProcesses } from '@/hooks/useUiPathProcesses';
import { useUiPathAuth } from '@/contexts/UiPathAuthContext';

function MyComponent() {
  // Get authentication state from context
  const { isAuthenticated } = useUiPathAuth();
  
  // ✅ Use hooks with authentication state
  const { data: processes, isLoading, error } = useUiPathProcesses(undefined, isAuthenticated);
  // processes contains REAL data from your UiPath environment
}
```

### Why No Mock Data?
- The UiPath SDK is already configured and authenticated
- All hooks are ready to use immediately
- Real data provides accurate testing
- Mock data creates false expectations and bugs

All UiPath functionality is accessible through pre-built hooks. DO NOT create fetch() calls, mock data, or API endpoints.

## Overview
UiPath Dashboard Template - Frontend-only React application with pre-configured uipath-sdk SDK for building automation management interfaces.

- Frontend: React Router 6 + TypeScript + ShadCN UI + UiPath Components
- UiPath Integration: Pre-configured SDK client with React Query hooks
- Architecture: Pure frontend - UiPath SDK runs directly in the browser

## 🎯 UiPath SDK Integration

### OAuth Authentication
**⚠️ CRITICAL: The UiPath SDK uses OAuth authentication. You MUST use the authentication context pattern.**

**Required Authentication Pattern:**

1. **Wrap your app with UiPathAuthProvider** (handles SDK initialization automatically):
```typescript
import { UiPathAuthProvider } from '@/contexts/UiPathAuthContext';

function App() {
  return (
    <UiPathAuthProvider>
      {/* Your app components */}
    </UiPathAuthProvider>
  );
}
```

2. **Use the useUiPathAuth hook in components** to get authentication state:
```typescript
import { useUiPathAuth } from '@/contexts/UiPathAuthContext';

function MyComponent() {
  const { isInitializing, isAuthenticated, error } = useUiPathAuth();
  
  // Pass authentication state to hooks
  const { data } = useUiPathProcesses(undefined, isAuthenticated);
}
```

3. **Use AuthWrapper component for pages** (handles loading/error UI):
```typescript
import { AuthWrapper } from '@/components/AuthWrapper';

export function MyPage() {
  return (
    <AuthWrapper>
      {/* Your authenticated content */}
    </AuthWrapper>
  );
}
```

### ⛔ Authentication Rules:
1. **NEVER call `initializeUiPathSDK()` directly** - The AuthProvider handles this
2. **ALWAYS use the auth context** - Get authentication state from `useUiPathAuth()`
3. **Pass `isAuthenticated` to hooks** - Controls when queries are enabled

❌ **NEVER DO THIS:**
```typescript
// ❌ NO - Don't initialize SDK directly in components
import { initializeUiPathSDK } from '@/lib/uipath';
useEffect(() => {
  initializeUiPathSDK(); // Wrong - use AuthProvider instead
}, []);

// ❌ NO - Don't manage SDK state manually
const [isSDKReady, setIsSDKReady] = useState(false);
await initializeUiPathSDK();
setIsSDKReady(true);

// ❌ NO - Don't call getUiPath() without auth context
import { getUiPath } from '@/lib/uipath';
const uipath = getUiPath(); // May not be initialized

// ❌ NO - Don't create SDK instances directly
import { UiPath } from 'uipath-sdk';
const client = new UiPath({ baseUrl: '...' });
```

✅ **ALWAYS DO THIS:**
```typescript
// ✅ Use the authentication context pattern
import { useUiPathAuth } from '@/contexts/UiPathAuthContext';
import { useUiPathProcesses } from '@/hooks/useUiPathProcesses';

function MyComponent() {
  // Get auth state from context (SDK initialization is handled by AuthProvider)
  const { isAuthenticated, isInitializing, error } = useUiPathAuth();
  
  // Use hooks with auth state
  const { data: processes } = useUiPathProcesses(undefined, isAuthenticated);
  
  if (isInitializing) return <div>Initializing...</div>;
  if (error) return <div>Error: {error}</div>;
  
  // Your component logic
}
```

### Available React Query Hooks
**⚠️ IMPORTANT: These hooks return REAL data from your UiPath environment. NEVER create mock data - use these hooks directly.**

**Authentication-Aware Hooks:**
All hooks properly check authentication status and will throw an error if not authenticated. They also use intelligent caching instead of constant polling:
- Data is cached for 5 minutes (processes, assets) or 2 minutes (queues, tasks)
- No unnecessary refetchInterval - authentication state drives data fetching
- Proper error handling for authentication failures

Use these hooks in your components for automatic caching, refetching, and loading states:

**Processes:**
- `useUiPathProcesses(folderId?)` - Get all processes
- `useUiPathProcess(processId, folderId?)` - Get specific process
- `useStartProcess()` - Mutation to start a process

**Queues:**
- `useUiPathQueues(folderId?)` - Get all queues
- `useUiPathQueue(queueId, folderId?)` - Get specific queue

**Tasks:**
- `useUiPathTasks(folderId?)` - Get all tasks
- `useAssignTask()` - Mutation to assign task
- `useCompleteTask()` - Mutation to complete task

**Assets:**
- `useUiPathAssets(folderId?)` - Get all assets
- `useUiPathAsset(assetId, folderId?)` - Get specific asset

**Maestro:**
- `useUiPathMaestroProcesses()` - Get Maestro processes
- `useUiPathMaestroInstances()` - Get process instances
- `usePauseMaestroInstance()` - Pause instance
- `useResumeMaestroInstance()` - Resume instance
- `useCancelMaestroInstance()` - Cancel instance

### Pre-built UiPath Components
Located in `src/components/uipath/`:

1. **JobStatusBadge** - Color-coded status indicators
   ```typescript
   <JobStatusBadge status="Running" />
   ```

2. **ProcessCard** - Display and start processes
   ```typescript
   <ProcessCard
     process={process}
     onStart={handleStart}
   />
   ```

3. **QueueMonitor** - Show queue statistics
   ```typescript
   <QueueMonitor queue={queue} />
   ```

4. **TaskCard** - Manage Action Center tasks
   ```typescript
   <TaskCard
     task={task}
     onAssign={handleAssign}
     onComplete={handleComplete}
   />
   ```

## 📋 Example Usage Pattern

**This example shows the complete pattern with authentication context:**

```typescript
import { useUiPathAuth } from '@/contexts/UiPathAuthContext';
import { useUiPathProcesses, useStartProcess } from '@/hooks/useUiPathProcesses';
import { ProcessCard } from '@/components/uipath/ProcessCard';
import { AuthWrapper } from '@/components/AuthWrapper';

export function MyPage() {
  return (
    <AuthWrapper>
      <ProcessList />
    </AuthWrapper>
  );
}

function ProcessList() {
  const { isAuthenticated } = useUiPathAuth();
  
  // ✅ Hook fetches REAL processes from UiPath - no mock data needed
  const { data: processes, isLoading } = useUiPathProcesses(undefined, isAuthenticated);
  const { mutate: startProcess } = useStartProcess();

  if (isLoading) return <div>Loading...</div>;

  // ✅ processes contains REAL data from your UiPath Orchestrator
  return (
    <div>
      {processes?.map(process => (
        <ProcessCard
          key={process.id}
          process={process}
          onStart={(key) => startProcess({ processKey: key })}
        />
      ))}
    </div>
  );
}
```

**❌ NEVER do this:**
```typescript
// ❌ NO - Don't create mock data
const mockProcesses = [{ id: 1, name: 'Fake Process' }];

// ❌ NO - Don't use placeholder data
const [processes, setProcesses] = useState([]);
```

## 🎨 UiPath Branding
The template uses UiPath's brand colors:
- Primary Orange: `#FA4616`
- Dark Blue: `#1A1E28`

These are set as CSS variables and used throughout the components.

## Tech Stack
- React Router 6, ShadCN UI, Tailwind, Lucide, TypeScript
- uipath-sdk SDK (runs in browser)
- @tanstack/react-query for data fetching
- date-fns for date formatting
- Vite for build tooling

## Development Restrictions

### ⛔ ABSOLUTE PROHIBITIONS:
1. **NO MOCK DATA EVER**
   - ❌ NO mock/dummy/sample/placeholder data
   - ❌ NO hardcoded data arrays or objects for UiPath entities
   - ❌ NO fake data during development or testing
   - ✅ ONLY use real data from UiPath SDK hooks

2. **NO CUSTOM API CALLS**
   - ❌ NO fetch() calls
   - ❌ NO axios calls
   - ❌ NO custom API endpoints
   - ✅ ONLY use provided React Query hooks

3. **AUTHENTICATION CONTEXT REQUIRED**
   - ✅ ALWAYS wrap app with UiPathAuthProvider
   - ✅ USE useUiPathAuth hook for auth state
   - ✅ PASS isAuthenticated to hook enabled parameter
   - ❌ NO direct SDK initialization in components
   - ❌ NO manual SDK state management

4. **Other Restrictions**
   - **Components**: Use existing ShadCN components instead of writing custom ones
   - **Icons**: Import from `lucide-react` directly
   - **Frontend Only**: This is a pure frontend app - all UiPath API calls happen from the browser

## Code Organization

### Application Structure
- `src/lib/uipath.ts` - UiPath SDK client configuration
- `src/hooks/` - React Query hooks for UiPath services
- `src/components/uipath/` - UiPath-specific components
- `src/components/ui/` - ShadCN UI components (auto-generated)
- `src/pages/DashboardPage.tsx` - Main dashboard example

## Important Notes

### UiPath SDK Configuration
**⚠️ CRITICAL: You MUST create a `.env` file with OAuth configuration.**

**REQUIRED: Create `.env` file in project root with these variables:**
```env
VITE_UIPATH_BASE_URL=<user's UiPath instance URL>
VITE_UIPATH_ORG_NAME=<organization name>
VITE_UIPATH_TENANT_NAME=<tenant name>
VITE_UIPATH_CLIENT_ID=<OAuth client ID from External App>
VITE_UIPATH_REDIRECT_URI=<OAuth redirect URI (optional, defaults to app origin)>
VITE_UIPATH_SCOPE=<OAuth scopes (optional, defaults to common Orchestrator scopes)>
```

**How it works internally:**
The `UiPathAuthProvider` automatically reads these environment variables and initializes the SDK with OAuth when your app starts. You don't need to call initialization manually.

**ABSOLUTE RULES:**
- ✅ **ALWAYS create `.env` file** with OAuth configuration
- ✅ **Use OAuth Client ID** from External App configuration (required)
- ✅ **Wrap your app with `UiPathAuthProvider`** - It handles SDK initialization
- ✅ **Use `useUiPathAuth` hook** to get authentication state
- ❌ **NEVER call `initializeUiPathSDK()` directly** - Let the AuthProvider handle it
- ❌ **NEVER skip the auth context pattern**
- ❌ **NEVER use placeholder/demo credentials**

### Error Handling
All React Query hooks include automatic error handling with toast notifications.
Errors are displayed to users automatically.

### Polling/Refetching
- Processes: Refetch every 30 seconds
- Queues: Refetch every 10 seconds (for real-time monitoring)
- Tasks: Refetch every 15 seconds
- Maestro: Instances every 10 seconds, processes every 30 seconds

### Folder Context
Most UiPath operations support an optional `folderId` parameter to filter by Orchestrator folder.
Pass it to hooks when needed:
```typescript
const { data } = useUiPathProcesses(folderId);
```

## Extending the Template

### Adding New UiPath Services
1. Create a new hook in `src/hooks/useUiPath[Service].ts`
2. Use React Query's `useQuery` or `useMutation`
3. Import and use the `uipath` client from `src/lib/uipath`

### Adding Custom Components
1. Create component in `src/components/uipath/`
2. Use existing shadcn/ui components as building blocks
3. Follow UiPath branding guidelines (colors, typography)

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in your router configuration
3. Import and use UiPath hooks as needed

## Deployment
```bash
npm run build
```

The build creates a static site in the `dist/` directory that can be deployed to any static hosting service (Cloudflare Pages, Vercel, Netlify, etc.).
