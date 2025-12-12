import { Outlet } from 'react-router-dom';
import { ModeratorSidebar } from './ModeratorSidebar';

export function ModeratorLayout() {
  return (
    <div className="min-h-screen bg-background">
      <ModeratorSidebar />
      <main className="ml-64 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}
