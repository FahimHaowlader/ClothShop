import {Outlet} from "react-router";






const CollectionLayout = () => {
    
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Main Content (Child routes render here) */}
      <main className="flex-1 min-h-[2400px] w-full bg-bg-primary font-primary ">
        <Outlet />
      </main>
    </div>
  );
};

export default CollectionLayout;