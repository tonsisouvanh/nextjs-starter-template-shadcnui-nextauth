import React from 'react';

export default function loading() {
  return (
    <div className="bg-whie flex min-h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="relative mb-4">
          LOGO
          <div className="absolute -bottom-2 left-0 w-full">
            <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-1/3 animate-[loading_1s_ease-in-out_infinite] bg-primary"></div>
            </div>
          </div>
        </div>
        <p className="text-md animate-pulse font-medium text-muted-foreground">ກຳລັງໂຫຼດ...</p>
      </div>
    </div>
  );
}
