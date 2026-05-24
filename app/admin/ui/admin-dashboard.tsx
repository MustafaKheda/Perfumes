"use client";

import {
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  RefreshCcw,
  Search,
  ShoppingBag,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/api/uploads";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN";
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Collection = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
  tag: string | null;
  isActive: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  collections?: Collection[];
  createdAt: string;
};

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerEmail: string;
  customerName: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
};

type AdminCartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  addedAt: string;
  updatedAt: string;
};

type AdminCart = {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  items: AdminCartItem[];
  totalQuantity: number;
  subtotal: number;
  lastUpdatedAt: string;
};

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  image: string;
  imagePublicId: string;
  price: string;
  stock: string;
  tag: string;
  notes: string;
  categoryId: string;
  collectionIds: string[];
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
};

type NavId = "overview" | "create" | "products" | "collections" | "orders" | "carts";

const navItems: Array<{ id: NavId; label: string; icon: LucideIcon }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: Package },
  { id: "collections", label: "Collections", icon: ListOrdered },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "carts", label: "Carts", icon: ShoppingBag },
];

const orderStatuses = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

const paymentStatuses = ["PENDING", "SUCCESS", "FAILED", "REFUNDED"] as const;
const productTags = ["", "HOT", "NEW", "POPULAR", "LUXURY"] as const;

const emptyProductForm: ProductForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  imagePublicId: "",
  price: "",
  stock: "",
  tag: "",
  notes: "",
  categoryId: "",
  collectionIds: [],
  isBestSeller: false,
  isFeatured: false,
  isActive: true,
};

export default function AdminDashboard({ admin }: { admin: AdminUser }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<NavId>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [carts, setCarts] = useState<AdminCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingCollectionId, setUpdatingCollectionId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");

  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);

  const [orderFilters, setOrderFilters] = useState({
    q: "",
    status: "",
    paymentStatus: "",
  });

  const orderQuery = useMemo(() => {
    const params = new URLSearchParams({ page: "1", limit: "50" });

    if (orderFilters.q.trim()) {
      params.set("q", orderFilters.q.trim());
    }

    if (orderFilters.status) {
      params.set("status", orderFilters.status);
    }

    if (orderFilters.paymentStatus) {
      params.set("paymentStatus", orderFilters.paymentStatus);
    }

    return params.toString();
  }, [orderFilters]);

  const stats = useMemo(() => {
    const activeProducts = products.filter((product) => product.isActive).length;
    const lowStockProducts = products.filter((product) => product.stock <= 5).length;
    const pendingOrders = orders.filter((order) =>
      ["PENDING", "PAID", "PROCESSING"].includes(order.status),
    ).length;
    const orderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const openCarts = carts.length;

    return {
      totalProducts: products.length,
      activeProducts,
      lowStockProducts,
      pendingOrders,
      orderValue,
      openCarts,
    };
  }, [carts, orders, products]);

  const visibleProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.slug, product.category.name, product.tag ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [productSearch, products]);

  const selectedNavItem = navItems.find((item) => item.id === activeView) ?? navItems[0];

  const handleUnauthorized = useCallback(() => {
    router.replace("/admin/login");
    router.refresh();
  }, [router]);

  const readAdminJson = useCallback(
    async <T,>(response: Response, fallbackMessage: string) => {
      const body = (await response.json().catch(() => null)) as
        | ({ error?: string } & Partial<T>)
        | null;

      if (response.status === 401) {
        handleUnauthorized();
        throw new Error("Admin login required");
      }

      if (!response.ok || body?.error) {
        throw new Error(body?.error ?? fallbackMessage);
      }

      return body as T;
    },
    [handleUnauthorized],
  );

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoriesRes, collectionsRes, productsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/collections"),
        fetch("/api/admin/products"),
      ]);

      const categoriesJson = await readAdminJson<{ data: Category[] }>(
        categoriesRes,
        "Failed to load categories",
      );
      const collectionsJson = await readAdminJson<{ data: Collection[] }>(
        collectionsRes,
        "Failed to load collections",
      );
      const productsJson = await readAdminJson<{ data: Product[] }>(
        productsRes,
        "Failed to load products",
      );

      setCategories(categoriesJson.data);
      setCollections(collectionsJson.data);
      setProducts(productsJson.data);
      setProductForm((prev) => ({
        ...prev,
        categoryId: prev.categoryId || categoriesJson.data[0]?.id || "",
      }));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load admin dashboard data",
      );
    } finally {
      setLoading(false);
    }
  }, [readAdminJson]);

  const loadOrders = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/orders?${orderQuery}`);
      const json = await readAdminJson<{ data: Order[] }>(
        response,
        "Failed to load orders",
      );
      setOrders(json.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load orders");
    }
  }, [orderQuery, readAdminJson]);

  const loadCarts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/carts");
      const json = await readAdminJson<{ data: AdminCart[] }>(
        response,
        "Failed to load carts",
      );
      setCarts(json.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load carts");
    }
  }, [readAdminJson]);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    void loadCarts();
  }, [loadCarts]);

  async function onCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProduct(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          notes: productForm.notes
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          tag: productForm.tag || null,
        }),
      });
      const body = await readAdminJson<{ data: Product; message: string }>(
        response,
        "Failed to create product",
      );

      setProducts((prev) => [body.data, ...prev].slice(0, 100));
      setProductForm((prev) => ({
        ...emptyProductForm,
        categoryId: prev.categoryId,
      }));
      setActiveView("products");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create product",
      );
    } finally {
      setSavingProduct(false);
    }
  }

  async function onUploadProductImage(file: File) {
    setUploadingImage(true);
    setError(null);

    try {
      const signatureResponse = await fetch("/api/admin/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "scentora/products" }),
      });
      const signatureJson = await readAdminJson<{
        data: {
          cloudName: string;
          apiKey: string;
          folder: string;
          timestamp: number;
          signature: string;
        };
      }>(signatureResponse, "Failed to generate upload signature");

      const uploaded = await uploadImageToCloudinary(file, signatureJson.data);
      setProductForm((prev) => ({
        ...prev,
        image: uploaded.secure_url,
        imagePublicId: uploaded.public_id,
      }));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Failed to upload image",
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function onUpdateOrder(
    orderId: string,
    payload: { status?: string; paymentStatus?: string },
  ) {
    setUpdatingOrderId(orderId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await readAdminJson<{ data: Order; message: string }>(
        response,
        "Failed to update order",
      );

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? body.data : order)),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Failed to update order",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function onUpdateCollectionOrder(collectionId: string, displayOrder: number) {
    setUpdatingCollectionId(collectionId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/collections/${collectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder }),
      });
      const body = await readAdminJson<{ data: Collection; message: string }>(
        response,
        "Failed to update collection order",
      );

      setCollections((prev) =>
        prev
          .map((collection) =>
            collection.id === collectionId ? body.data : collection,
          )
          .sort((left, right) =>
            left.displayOrder === right.displayOrder
              ? left.name.localeCompare(right.name)
              : left.displayOrder - right.displayOrder,
          ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update collection order",
      );
    } finally {
      setUpdatingCollectionId(null);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  function renderActiveView() {
    if (loading) {
      return <LoadingPanel />;
    }

    if (activeView === "create") {
      return (
        <CreateProductView
          categories={categories}
          collections={collections}
          form={productForm}
          savingProduct={savingProduct}
          uploadingImage={uploadingImage}
          onChange={setProductForm}
          onCreateProduct={onCreateProduct}
          onUploadProductImage={onUploadProductImage}
        />
      );
    }

    if (activeView === "products") {
      return (
        <ProductsView
          products={visibleProducts}
          query={productSearch}
          onQueryChange={setProductSearch}
        />
      );
    }

    if (activeView === "collections") {
      return (
        <CollectionsView
          collections={collections}
          updatingCollectionId={updatingCollectionId}
          onUpdateCollectionOrder={onUpdateCollectionOrder}
        />
      );
    }

    if (activeView === "orders") {
      return (
        <OrdersView
          filters={orderFilters}
          orders={orders}
          updatingOrderId={updatingOrderId}
          onFiltersChange={setOrderFilters}
          onUpdateOrder={onUpdateOrder}
        />
      );
    }

    if (activeView === "carts") {
      return <CartsView carts={carts} />;
    }

    return (
      <OverviewView
        carts={carts}
        orders={orders}
        products={products}
        stats={stats}
        onChangeView={setActiveView}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-slate-950 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      {mobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Close admin sidebar"
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      ) : null}

      <AdminSidebar
        activeView={activeView}
        admin={admin}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onLogout={onLogout}
        onSelect={(id) => {
          setActiveView(id);
          setMobileSidebarOpen(false);
        }}
      />

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open admin sidebar"
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Admin
                </p>
                <h1 className="truncate font-heading text-2xl font-semibold">
                  {selectedNavItem.label}
                </h1>
              </div>
            </div>

            <button
              type="button"
              title="Refresh dashboard data"
              aria-label="Refresh dashboard data"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => {
                void loadInitialData();
                void loadOrders();
                void loadCarts();
              }}
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          {error ? (
            <section className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>{error}</p>
            </section>
          ) : null}

          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({
  activeView,
  admin,
  mobileOpen,
  onClose,
  onLogout,
  onSelect,
}: {
  activeView: NavId;
  admin: AdminUser;
  mobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSelect: (id: NavId) => void;
}) {
  const initials =
    admin.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SA";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[280px] flex-col border-r border-white/10 bg-[#111827] text-white shadow-xl transition-transform lg:sticky lg:top-0 lg:z-auto lg:flex lg:h-screen lg:translate-x-0 lg:shadow-none ${
        mobileOpen ? "flex translate-x-0" : "hidden -translate-x-full"
      }`}
    >
      <div className="flex min-h-16 items-center justify-between border-b border-white/10 px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Scentora
          </p>
          <p className="font-heading text-2xl font-semibold">Admin</p>
        </div>
        <button
          type="button"
          aria-label="Close admin sidebar"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-300 lg:hidden"
          onClick={onClose}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition ${
                active
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => onSelect(item.id)}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-white/8 p-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-sm font-bold text-slate-950">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {admin.name || "Scentora Admin"}
            </p>
            <p className="truncate text-xs text-slate-400">{admin.email}</p>
          </div>
        </div>
        <button
          type="button"
          className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 text-sm font-semibold text-slate-200 hover:bg-white/10"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function OverviewView({
  carts,
  orders,
  products,
  stats,
  onChangeView,
}: {
  carts: AdminCart[];
  orders: Order[];
  products: Product[];
  stats: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    pendingOrders: number;
    orderValue: number;
    openCarts: number;
  };
  onChangeView: (id: NavId) => void;
}) {
  const lowStockProducts = products.filter((product) => product.stock <= 5).slice(0, 6);
  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Package}
          label="Total Products"
          value={String(stats.totalProducts)}
          tone="slate"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Active Products"
          value={String(stats.activeProducts)}
          tone="green"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Low Stock"
          value={String(stats.lowStockProducts)}
          tone="amber"
        />
        <MetricCard
          icon={ShoppingBag}
          label="Open Carts"
          value={String(stats.openCarts)}
          tone="blue"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-lg border border-slate-200 bg-white">
          <PanelHeader
            eyebrow="Inventory"
            title="Low stock products"
            actionLabel="View products"
            onAction={() => onChangeView("products")}
          />
          {lowStockProducts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.category.name}</p>
                  </div>
                  <StatusPill
                    label={`${product.stock} left`}
                    tone={product.stock === 0 ? "danger" : "warning"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No low stock products" />
          )}
        </article>

        <article className="rounded-lg border border-slate-200 bg-white">
          <PanelHeader
            eyebrow="Orders"
            title="Recent activity"
            actionLabel="View orders"
            onAction={() => onChangeView("orders")}
          />
          {recentOrders.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {order.customerName || order.customerEmail}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(order.createdAt)} · {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatInr(order.totalAmount)}</p>
                    <StatusPill label={order.status} tone={toneForStatus(order.status)} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No orders loaded" />
          )}
        </article>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white">
        <PanelHeader
          eyebrow="Customer carts"
          title="Recent cart activity"
          actionLabel="View carts"
          onAction={() => onChangeView("carts")}
        />
        {carts.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {carts.slice(0, 6).map((cart) => (
              <div
                key={cart.user.id}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {cart.user.name || cart.user.email}
                  </p>
                  <p className="text-xs text-slate-500">
                    {cart.totalQuantity} items · {formatDate(cart.lastUpdatedAt)}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatInr(cart.subtotal)}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No customer carts yet" />
        )}
      </section>
    </div>
  );
}

function CreateProductView({
  categories,
  collections,
  form,
  savingProduct,
  uploadingImage,
  onChange,
  onCreateProduct,
  onUploadProductImage,
}: {
  categories: Category[];
  collections: Collection[];
  form: ProductForm;
  savingProduct: boolean;
  uploadingImage: boolean;
  onChange: Dispatch<SetStateAction<ProductForm>>;
  onCreateProduct: (event: FormEvent<HTMLFormElement>) => void;
  onUploadProductImage: (file: File) => void;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <article className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Catalog
            </p>
            <h2 className="font-heading text-3xl font-semibold">Create product</h2>
          </div>
          <StatusPill label={form.isActive ? "Active" : "Draft"} tone="neutral" />
        </div>

        <form onSubmit={onCreateProduct} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Name"
              value={form.name}
              onChange={(value) => onChange((prev) => ({ ...prev, name: value }))}
              required
            />
            <InputField
              label="Slug"
              value={form.slug}
              onChange={(value) => onChange((prev) => ({ ...prev, slug: value }))}
              placeholder="Auto-generated when blank"
            />
            <TextAreaField
              label="Description"
              value={form.description}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, description: value }))
              }
              className="md:col-span-2"
              required
            />
            <InputField
              label="Image URL"
              value={form.image}
              onChange={(value) => onChange((prev) => ({ ...prev, image: value }))}
              className="md:col-span-2"
              required
            />
            <InputField
              label="Cloudinary public id"
              value={form.imagePublicId}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, imagePublicId: value }))
              }
            />
            <InputField
              label="Notes"
              value={form.notes}
              onChange={(value) => onChange((prev) => ({ ...prev, notes: value }))}
              placeholder="Rose, Vanilla, Musk"
            />
            <InputField
              label="Price"
              type="number"
              value={form.price}
              min="0"
              step="0.01"
              onChange={(value) => onChange((prev) => ({ ...prev, price: value }))}
              required
            />
            <InputField
              label="Stock"
              type="number"
              value={form.stock}
              min="0"
              step="1"
              onChange={(value) => onChange((prev) => ({ ...prev, stock: value }))}
              required
            />
            <SelectField
              label="Category"
              value={form.categoryId}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, categoryId: value }))
              }
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Tag"
              value={form.tag}
              onChange={(value) => onChange((prev) => ({ ...prev, tag: value }))}
            >
              {productTags.map((tag) => (
                <option key={tag || "none"} value={tag}>
                  {tag || "No tag"}
                </option>
              ))}
            </SelectField>
          </div>

          <div>
            <label
              htmlFor="collectionIds"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Collections
            </label>
            <select
              id="collectionIds"
              multiple
              className="min-h-32 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
              value={form.collectionIds}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  collectionIds: Array.from(event.target.selectedOptions).map(
                    (option) => option.value,
                  ),
                }))
              }
            >
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <ToggleField
              label="Best seller"
              checked={form.isBestSeller}
              onChange={(checked) =>
                onChange((prev) => ({ ...prev, isBestSeller: checked }))
              }
            />
            <ToggleField
              label="Featured"
              checked={form.isFeatured}
              onChange={(checked) =>
                onChange((prev) => ({ ...prev, isFeatured: checked }))
              }
            />
            <ToggleField
              label="Active"
              checked={form.isActive}
              onChange={(checked) =>
                onChange((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label
              className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 ${
                uploadingImage ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              {uploadingImage ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    onUploadProductImage(file);
                  }
                }}
              />
            </label>

            <button
              type="submit"
              disabled={savingProduct || uploadingImage}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              {savingProduct ? "Creating..." : "Create product"}
            </button>
          </div>
        </form>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Media
        </p>
        <h2 className="mb-4 font-heading text-3xl font-semibold">Preview</h2>
        {form.image ? (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- Admin product images can be local paths or runtime Cloudinary URLs. */}
            <img
              src={form.image}
              alt="Product preview"
              className="aspect-[4/5] w-full rounded-lg border border-slate-200 object-cover"
            />
            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              <p className="break-all">URL: {form.image}</p>
              <p className="mt-1 break-all">
                Public ID: {form.imagePublicId || "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid aspect-[4/5] place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            No image selected
          </div>
        )}
      </article>
    </section>
  );
}

function ProductsView({
  products,
  query,
  onQueryChange,
}: {
  products: Product[];
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Inventory
          </p>
          <h2 className="font-heading text-3xl font-semibold">Products</h2>
        </div>
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder="Search products"
        />
      </div>

      {products.length > 0 ? (
        <div className="max-h-[calc(100vh-220px)] overflow-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Tags</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element -- Admin product images can be local paths or runtime Cloudinary URLs. */}
                      <img
                        src={product.image}
                        alt=""
                        className="h-11 w-11 rounded-lg border border-slate-200 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{product.name}</p>
                        <p className="truncate text-xs text-slate-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">{product.category.name}</td>
                  <td className="px-5 py-3 font-medium">{formatInr(product.price)}</td>
                  <td className="px-5 py-3">
                    <StatusPill
                      label={String(product.stock)}
                      tone={product.stock <= 5 ? "warning" : "neutral"}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      {product.tag ? (
                        <StatusPill label={product.tag} tone="accent" />
                      ) : null}
                      {product.isBestSeller ? (
                        <StatusPill label="BEST" tone="blue" />
                      ) : null}
                      {product.isFeatured ? (
                        <StatusPill label="FEATURED" tone="green" />
                      ) : null}
                      {!product.tag && !product.isBestSeller && !product.isFeatured ? (
                        <span className="text-xs text-slate-400">None</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill
                      label={product.isActive ? "ACTIVE" : "INACTIVE"}
                      tone={product.isActive ? "green" : "neutral"}
                    />
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {formatDate(product.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No products found" />
      )}
    </section>
  );
}

function CollectionsView({
  collections,
  updatingCollectionId,
  onUpdateCollectionOrder,
}: {
  collections: Collection[];
  updatingCollectionId: string | null;
  onUpdateCollectionOrder: (collectionId: string, displayOrder: number) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Merchandising
        </p>
        <h2 className="font-heading text-3xl font-semibold">Collection order</h2>
      </div>

      {collections.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="grid gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_180px]"
            >
              <div className="min-w-0">
                <p className="font-semibold">{collection.name}</p>
                <p className="text-sm text-slate-500">/{collection.slug}</p>
              </div>
              <InputField
                label={`${collection.name} order`}
                type="number"
                min="0"
                step="1"
                value={String(collection.displayOrder)}
                onChange={(value) => {
                  const displayOrder = Number(value);

                  if (Number.isInteger(displayOrder) && displayOrder >= 0) {
                    onUpdateCollectionOrder(collection.id, displayOrder);
                  }
                }}
                disabled={updatingCollectionId === collection.id}
                hideLabel
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No collections found" />
      )}
    </section>
  );
}

function OrdersView({
  filters,
  orders,
  updatingOrderId,
  onFiltersChange,
  onUpdateOrder,
}: {
  filters: {
    q: string;
    status: string;
    paymentStatus: string;
  };
  orders: Order[];
  updatingOrderId: string | null;
  onFiltersChange: Dispatch<
    SetStateAction<{
      q: string;
      status: string;
      paymentStatus: string;
    }>
  >;
  onUpdateOrder: (
    orderId: string,
    payload: { status?: string; paymentStatus?: string },
  ) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Fulfillment
          </p>
          <h2 className="font-heading text-3xl font-semibold">Orders</h2>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
          <SearchInput
            value={filters.q}
            onChange={(value) => onFiltersChange((prev) => ({ ...prev, q: value }))}
            placeholder="Search order, email, or customer"
          />
          <SelectField
            label="Order status"
            hideLabel
            value={filters.status}
            onChange={(value) =>
              onFiltersChange((prev) => ({ ...prev, status: value }))
            }
          >
            <option value="">All order statuses</option>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Payment status"
            hideLabel
            value={filters.paymentStatus}
            onChange={(value) =>
              onFiltersChange((prev) => ({ ...prev, paymentStatus: value }))
            }
          >
            <option value="">All payment statuses</option>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="max-h-[calc(100vh-250px)] overflow-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Items</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Order Status</th>
                <th className="px-5 py-3 font-semibold">Payment Status</th>
                <th className="px-5 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3 font-medium">
                    <span className="font-mono text-xs">{order.id}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-semibold">{order.customerName || "N/A"}</div>
                    <div className="text-xs text-slate-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-5 py-3">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-5 py-3 font-semibold">
                    {formatInr(order.totalAmount)}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      className="min-h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                      value={order.status}
                      disabled={updatingOrderId === order.id}
                      onChange={(event) =>
                        onUpdateOrder(order.id, { status: event.target.value })
                      }
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      className="min-h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                      value={order.paymentStatus}
                      disabled={updatingOrderId === order.id}
                      onChange={(event) =>
                        onUpdateOrder(order.id, {
                          paymentStatus: event.target.value,
                        })
                      }
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No orders found" />
      )}
    </section>
  );
}

function CartsView({ carts }: { carts: AdminCart[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Customer carts
        </p>
        <h2 className="font-heading text-3xl font-semibold">Saved cart items</h2>
      </div>

      {carts.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {carts.map((cart) => (
            <article key={cart.user.id} className="p-5">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold">
                    {cart.user.name || "Unnamed customer"}
                  </h3>
                  <p className="text-sm text-slate-500">{cart.user.email}</p>
                </div>
                <div className="text-sm sm:text-right">
                  <p className="font-semibold">{formatInr(cart.subtotal)}</p>
                  <p className="text-slate-500">
                    {cart.totalQuantity} items · Updated {formatDate(cart.lastUpdatedAt)}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-100">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold">Qty</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Line Total</th>
                      <th className="px-4 py-3 font-semibold">Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cart.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3">{item.quantity}</td>
                        <td className="px-4 py-3">{formatInr(item.price)}</td>
                        <td className="px-4 py-3 font-semibold">
                          {formatInr(item.price * item.quantity)}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(item.addedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No cart items found" />
      )}
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: LucideIcon;
  label: string;
  tone: "amber" | "blue" | "green" | "slate";
  value: string;
}) {
  const toneClass = {
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  }[tone];

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <div className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${toneClass}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      <p className="text-3xl font-semibold tracking-normal">{value}</p>
    </article>
  );
}

function PanelHeader({
  actionLabel,
  eyebrow,
  title,
  onAction,
}: {
  actionLabel: string;
  eyebrow: string;
  title: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      </div>
      <button
        type="button"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </div>
  );
}

function InputField({
  value,
  onChange,
  label,
  className,
  disabled,
  hideLabel,
  type = "text",
  required,
  min,
  step,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  type?: "text" | "number";
  required?: boolean;
  min?: string;
  step?: string;
  placeholder?: string;
}) {
  const id = `input-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`${hideLabel ? "sr-only" : "mb-2 block"} text-sm font-medium text-slate-700`}
      >
        {label}
      </label>
      <input
        id={id}
        className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
        placeholder={placeholder}
        value={value}
        type={type}
        disabled={disabled}
        required={required}
        min={min}
        step={step}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function TextAreaField({
  value,
  onChange,
  label,
  className,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
  required?: boolean;
}) {
  const id = `textarea-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        className="min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function SelectField({
  children,
  hideLabel,
  label,
  value,
  onChange,
  required,
}: {
  children: ReactNode;
  hideLabel?: boolean;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const id = `select-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <label
        htmlFor={id}
        className={`${hideLabel ? "sr-only" : "mb-2 block"} text-sm font-medium text-slate-700`}
      >
        {label}
      </label>
      <select
        id={id}
        className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-500 focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-slate-950/10 lg:max-w-sm">
      <Search className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{placeholder}</span>
      <input
        className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="inline-flex min-h-10 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        className={`relative h-5 w-9 rounded-full transition ${
          checked ? "bg-slate-950" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-4" : "left-0.5"
          }`}
        />
      </span>
      {label}
    </label>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "accent" | "blue" | "danger" | "green" | "neutral" | "warning";
}) {
  const toneClass = {
    accent: "border-orange-200 bg-orange-50 text-orange-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    neutral: "border-slate-200 bg-slate-100 text-slate-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
  }[tone];

  return (
    <span
      className={`inline-flex min-h-6 items-center rounded-full border px-2 text-xs font-semibold ${toneClass}`}
    >
      {label}
    </span>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="grid min-h-48 place-items-center px-5 py-10 text-center text-sm text-slate-500">
      <div>
        <Boxes className="mx-auto mb-3 h-8 w-8 text-slate-300" aria-hidden="true" />
        <p>{title}</p>
      </div>
    </div>
  );
}

function LoadingPanel() {
  return (
    <section className="grid min-h-64 place-items-center rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
      Loading admin dashboard...
    </section>
  );
}

function toneForStatus(status: string): "blue" | "danger" | "green" | "neutral" | "warning" {
  if (["DELIVERED", "SHIPPED", "SUCCESS"].includes(status)) {
    return "green";
  }

  if (["CANCELLED", "REFUNDED", "FAILED"].includes(status)) {
    return "danger";
  }

  if (["PAID", "PROCESSING"].includes(status)) {
    return "blue";
  }

  return status === "PENDING" ? "warning" : "neutral";
}

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
