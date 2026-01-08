# UiPath Orchestrator Management Console

A comprehensive enterprise management console for UiPath Orchestrator that provides centralized monitoring and control of automation resources. Built with React, TypeScript, and the UiPath SDK for seamless integration with your automation infrastructure.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swati354/uipath-orchestrator-check)

## Features

- **Processes & Assets Management**: View and manage all automation processes with quick-start capabilities and secure asset configuration
- **Action Center Tasks**: Dedicated task management interface for pending, assigned, and completed tasks with assignment workflows
- **Real-time Monitoring**: Live status updates with automatic refresh intervals for critical automation workflows
- **Enterprise UI**: Professional tabbed interface with information-dense layouts optimized for business users
- **Secure Authentication**: OAuth-based authentication with UiPath Orchestrator
- **Responsive Design**: Mobile-friendly interface that works across all device sizes

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI primitives
- **UiPath Integration**: UiPath TypeScript SDK with OAuth authentication
- **Data Fetching**: TanStack React Query for efficient caching and synchronization
- **State Management**: Zustand for client-side state
- **Build Tool**: Vite for fast development and optimized builds
- **Deployment**: Cloudflare Pages for global edge deployment
- **Icons**: Lucide React for consistent iconography
- **Notifications**: Sonner for user feedback

## Prerequisites

- [Bun](https://bun.sh/) runtime (latest version)
- UiPath Orchestrator instance with OAuth External App configured
- Modern web browser with JavaScript enabled

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uipath-orchestrator-console
```

2. Install dependencies:
```bash
bun install
```

3. Configure environment variables by creating a `.env` file:
```env
VITE_UIPATH_BASE_URL=https://your-orchestrator-instance.com
VITE_UIPATH_ORG_NAME=your-organization-name
VITE_UIPATH_TENANT_NAME=your-tenant-name
VITE_UIPATH_CLIENT_ID=your-oauth-client-id
VITE_UIPATH_REDIRECT_URI=http://localhost:3000
VITE_UIPATH_SCOPE=OR.Execution OR.Assets OR.Tasks
```

## UiPath OAuth Setup

1. In UiPath Orchestrator, navigate to **Admin** > **External Applications**
2. Create a new External Application with:
   - **Application Type**: Confidential Application
   - **Redirect URIs**: Add your application URL (e.g., `http://localhost:3000` for development)
   - **Scopes**: Select required scopes (OR.Execution, OR.Assets, OR.Tasks, etc.)
3. Copy the **Client ID** and use it in your `.env` file

## Development

Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run lint` - Run ESLint

## Usage

### Processes & Assets Tab

- **View Processes**: Browse all available automation processes with status indicators
- **Start Processes**: Launch processes directly from the interface with one-click execution
- **Monitor Status**: Real-time status updates with color-coded indicators (green for success, yellow for running, red for errors)
- **Asset Management**: View configuration assets with secure value masking for credentials

### Action Center Tasks Tab

- **Task Overview**: Comprehensive list of tasks requiring attention with filtering capabilities
- **Task Assignment**: Assign tasks to users through intuitive workflows
- **Task Completion**: Complete tasks with structured data capture forms
- **Status Tracking**: Monitor task progress from pending to completion

### Authentication Flow

The application uses OAuth 2.0 with UiPath Orchestrator:

1. Users are redirected to UiPath login when accessing the application
2. After successful authentication, users are redirected back with authorization code
3. The SDK automatically handles token exchange and refresh
4. All API calls are authenticated using the obtained access token

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── uipath/         # UiPath-specific components
├── contexts/           # React contexts (authentication)
├── hooks/              # Custom React hooks for UiPath SDK
├── lib/                # Utility functions and SDK configuration
└── pages/              # Application pages and routes
```

## Key Components

- **UiPathAuthContext**: Manages OAuth authentication state
- **ProcessCard**: Displays process information with start actions
- **TaskCard**: Shows task details with assignment/completion workflows
- **JobStatusBadge**: Color-coded status indicators
- **QueueMonitor**: Real-time queue statistics

## Deployment

### Cloudflare Pages

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/swati354/uipath-orchestrator-check)

For manual deployment:

1. Build the application:
```bash
bun run build
```

2. Deploy to Cloudflare Pages:
```bash
npx wrangler pages deploy dist
```

3. Configure environment variables in Cloudflare Pages dashboard:
   - Add all `VITE_*` variables from your `.env` file
   - Update `VITE_UIPATH_REDIRECT_URI` to your production URL

### Other Platforms

The built application in the `dist/` directory can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload `dist` contents to S3 bucket
- **GitHub Pages**: Push `dist` contents to `gh-pages` branch

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_UIPATH_BASE_URL` | UiPath Orchestrator instance URL | Yes |
| `VITE_UIPATH_ORG_NAME` | Organization name | Yes |
| `VITE_UIPATH_TENANT_NAME` | Tenant name | Yes |
| `VITE_UIPATH_CLIENT_ID` | OAuth client ID from External App | Yes |
| `VITE_UIPATH_REDIRECT_URI` | OAuth redirect URI | No (defaults to current origin) |
| `VITE_UIPATH_SCOPE` | OAuth scopes | No (defaults to common scopes) |

### Folder Context

Most UiPath operations support folder-based filtering. The application automatically detects available folders and allows users to filter resources by organizational folder structure.

## Troubleshooting

### Authentication Issues

- Verify OAuth client configuration in UiPath Orchestrator
- Ensure redirect URI matches exactly (including protocol and port)
- Check that required scopes are granted to the External Application

### API Errors

- Confirm UiPath Orchestrator is accessible from your network
- Verify user permissions for the resources you're trying to access
- Check browser console for detailed error messages

### Build Issues

- Ensure all environment variables are properly set
- Clear node_modules and reinstall: `rm -rf node_modules && bun install`
- Check for TypeScript errors: `bun run lint`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:

- Check the [UiPath SDK Documentation](https://docs.uipath.com/)
- Review UiPath Orchestrator API documentation
- Open an issue in this repository for bugs or feature requests