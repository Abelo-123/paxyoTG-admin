// Create a new TypeScript declaration file (e.g., `telegram.d.ts`)
// Or add this at the top of your `page.tsx` file

declare global {
    interface Window {
      Telegram: {
        WebApp: {
          initDataUnsafe: {
            user: {
              id: number; // User ID
              username: string;
              first_name: string;
              last_name: string;
            };
          };
        };
      };
    }
  }
  