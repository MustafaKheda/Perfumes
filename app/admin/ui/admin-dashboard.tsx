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
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Mail,
  Menu,
  MessageSquareText,
  Package,
  PlusCircle,
  RefreshCcw,
  Search,
  Settings,
  ShoppingBag,
  Trophy,
  Upload,
  Users,
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
  description: string;
  detailedDescription: string | null;
  productDetailHtml: string | null;
  price: number;
  stock: number;
  tag: string | null;
  notes: string[];
  scentOptions: string[];
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
  scentOption: string | null;
};

type Order = {
  id: string;
  customerEmail: string;
  customerName: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  statusHistory: Array<{
    id: string;
    status: string;
    note: string | null;
    createdAt: string;
  }>;
  items: OrderItem[];
};

type AdminCartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  scentOption: string | null;
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

type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
};

type NewsletterSubscriber = {
  id: string;
  email: string;
  createdAt: string;
};

type SiteSettings = {
  promoBannerText: string;
  facebookUrl: string;
  xUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  contactPhone: string;
  contactEmail: string;
};

type BestSellerAdminProduct = {
  id: string;
  name: string;
  slug: string;
  image: string;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  metrics: {
    productId: string;
    monthlySold: number;
    trendingSold: number;
    totalSold: number;
  };
};

type BestSellerSettings = {
  mode: "auto" | "manual";
  products: BestSellerAdminProduct[];
};

type AdminCustomer = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
  cartItemCount: number;
  cartQuantity: number;
  lastCartUpdatedAt: string | null;
  activeSessionCount: number;
  lastSeenAt: string | null;
};

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  detailedDescription: string;
  productDetailHtml: string;
  image: string;
  imagePublicId: string;
  price: string;
  stock: string;
  tag: string;
  notes: string;
  scentOptions: string;
  categoryId: string;
  collectionIds: string[];
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
};

type NavId =
  | "overview"
  | "create"
  | "products"
  | "collections"
  | "orders"
  | "carts"
  | "messages"
  | "newsletter"
  | "users"
  | "settings"
  | "best-sellers";

const navItems: Array<{ id: NavId; label: string; icon: LucideIcon }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: Package },
  { id: "collections", label: "Collections", icon: ListOrdered },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "carts", label: "Carts", icon: ShoppingBag },
  { id: "best-sellers", label: "Best Sellers", icon: Trophy },
  { id: "messages", label: "Messages", icon: MessageSquareText },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
];

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
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
  detailedDescription: "",
  productDetailHtml: "",
  image: "",
  imagePublicId: "",
  price: "",
  stock: "",
  tag: "",
  notes: "",
  scentOptions: "Amber, Vanilla, Sandalwood",
  categoryId: "",
  collectionIds: [],
  isBestSeller: false,
  isFeatured: false,
  isActive: true,
};

const defaultSiteSettings: SiteSettings = {
  promoBannerText:
    "Free Shipping on Orders over 30KWD - Arrives Next Day From 5 to 9 PM",
  facebookUrl: "",
  xUrl: "",
  youtubeUrl: "",
  instagramUrl: "",
  contactPhone: "+96500000000",
  contactEmail: "support@scentora.com",
};

const defaultBestSellerSettings: BestSellerSettings = {
  mode: "auto",
  products: [],
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
  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<
    NewsletterSubscriber[]
  >([]);
  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(defaultSiteSettings);
  const [bestSellerSettings, setBestSellerSettings] =
    useState<BestSellerSettings>(defaultBestSellerSettings);
  const [usersList, setUsersList] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingCollectionId, setUpdatingCollectionId] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingBestSellers, setSavingBestSellers] = useState(false);
  const [evaluatingBestSellers, setEvaluatingBestSellers] = useState(false);
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
      ["PENDING", "CONFIRMED", "PAID", "PROCESSING"].includes(order.status),
    ).length;
    const orderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const openCarts = carts.length;
    const messages = contactInquiries.length;
    const subscribers = newsletterSubscribers.length;
    const usersCount = usersList.length;

    return {
      usersCount,
      totalProducts: products.length,
      activeProducts,
      lowStockProducts,
      pendingOrders,
      orderValue,
      openCarts,
      messages,
      subscribers,
    };
  }, [carts, contactInquiries, newsletterSubscribers, orders, products, usersList]);

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

  const loadContactInquiries = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/contact-inquiries");
      const json = await readAdminJson<{ data: ContactInquiry[] }>(
        response,
        "Failed to load contact messages",
      );
      setContactInquiries(json.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load contact messages",
      );
    }
  }, [readAdminJson]);

  const loadNewsletterSubscribers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/newsletter-subscribers");
      const json = await readAdminJson<{ data: NewsletterSubscriber[] }>(
        response,
        "Failed to load newsletter subscribers",
      );
      setNewsletterSubscribers(json.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load newsletter subscribers",
      );
    }
  }, [readAdminJson]);

  const loadUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users");
      const json = await readAdminJson<{ data: AdminCustomer[] }>(
        response,
        "Failed to load users",
      );
      setUsersList(json.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load users");
    }
  }, [readAdminJson]);

  const loadSiteSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/site-settings");
      const json = await readAdminJson<{ data: SiteSettings }>(
        response,
        "Failed to load site settings",
      );
      setSiteSettings(json.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load site settings",
      );
    }
  }, [readAdminJson]);

  const loadBestSellerSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/best-sellers");
      const json = await readAdminJson<{ data: BestSellerSettings }>(
        response,
        "Failed to load best seller settings",
      );
      setBestSellerSettings(json.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load best seller settings",
      );
    }
  }, [readAdminJson]);

  useEffect(() => {
    void Promise.resolve().then(loadInitialData);
  }, [loadInitialData]);

  useEffect(() => {
    void Promise.resolve().then(loadOrders);
  }, [loadOrders]);

  useEffect(() => {
    void Promise.resolve().then(loadCarts);
  }, [loadCarts]);

  useEffect(() => {
    void Promise.resolve().then(loadContactInquiries);
  }, [loadContactInquiries]);

  useEffect(() => {
    void Promise.resolve().then(loadNewsletterSubscribers);
  }, [loadNewsletterSubscribers]);

  useEffect(() => {
    void Promise.resolve().then(loadUsers);
  }, [loadUsers]);

  useEffect(() => {
    void Promise.resolve().then(loadSiteSettings);
  }, [loadSiteSettings]);

  useEffect(() => {
    void Promise.resolve().then(loadBestSellerSettings);
  }, [loadBestSellerSettings]);

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
          scentOptions: productForm.scentOptions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
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

  async function onSaveSiteSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingSettings(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings),
      });
      const body = await readAdminJson<{ data: SiteSettings; message: string }>(
        response,
        "Failed to save site settings",
      );

      setSiteSettings(body.data);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save site settings",
      );
    } finally {
      setSavingSettings(false);
    }
  }

  async function onEvaluateBestSellers() {
    setEvaluatingBestSellers(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/best-sellers", { method: "POST" });
      const body = await readAdminJson<{
        data: BestSellerSettings;
        message: string;
      }>(response, "Failed to evaluate best sellers");

      setBestSellerSettings(body.data);
      await loadInitialData();
    } catch (evaluateError) {
      setError(
        evaluateError instanceof Error
          ? evaluateError.message
          : "Failed to evaluate best sellers",
      );
    } finally {
      setEvaluatingBestSellers(false);
    }
  }

  async function onSaveBestSellers(nextSettings: BestSellerSettings) {
    setSavingBestSellers(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/best-sellers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          nextSettings.mode === "auto"
            ? { mode: "auto" }
            : {
                mode: "manual",
                bestSellerIds: nextSettings.products
                  .filter((product) => product.isBestSeller)
                  .map((product) => product.id),
                trendingIds: nextSettings.products
                  .filter((product) => product.isFeatured)
                  .map((product) => product.id),
              },
        ),
      });
      const body = await readAdminJson<{
        data: BestSellerSettings;
        message: string;
      }>(response, "Failed to save best seller settings");

      setBestSellerSettings(body.data);
      await loadInitialData();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save best seller settings",
      );
    } finally {
      setSavingBestSellers(false);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  function viewUserOrders(user: AdminCustomer) {
    setOrderFilters({
      q: user.email,
      status: "",
      paymentStatus: "",
    });
    setActiveView("orders");
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

    if (activeView === "best-sellers") {
      return (
        <BestSellerView
          settings={bestSellerSettings}
          saving={savingBestSellers}
          evaluating={evaluatingBestSellers}
          onChange={setBestSellerSettings}
          onSave={onSaveBestSellers}
          onEvaluate={onEvaluateBestSellers}
        />
      );
    }

    if (activeView === "messages") {
      return <ContactInquiriesView inquiries={contactInquiries} />;
    }

    if (activeView === "newsletter") {
      return <NewsletterSubscribersView subscribers={newsletterSubscribers} />;
    }

    if (activeView === "users") {
      return <UsersView users={usersList} onViewOrders={viewUserOrders} />;
    }

    if (activeView === "settings") {
      return (
        <SettingsView
          settings={siteSettings}
          savingSettings={savingSettings}
          onChange={setSiteSettings}
          onSave={onSaveSiteSettings}
        />
      );
    }

    return (
      <OverviewView
        carts={carts}
        orders={orders}
        products={products}
        users={usersList}
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
                void loadContactInquiries();
                void loadNewsletterSubscribers();
                void loadUsers();
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
  users,
  stats,
  onChangeView,
}: {
  carts: AdminCart[];
  orders: Order[];
  products: Product[];
  users: AdminCustomer[];
  stats: {
    usersCount: number;
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    pendingOrders: number;
    orderValue: number;
    openCarts: number;
    subscribers: number;
  };
  onChangeView: (id: NavId) => void;
}) {
  const lowStockProducts = products.filter((product) => product.stock <= 5).slice(0, 6);
  const recentOrders = orders.slice(0, 6);
  const recentUsers = users.slice(0, 6);
  const orderStatusCounts = orderStatuses.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));
  const maxOrderStatusCount = Math.max(
    ...orderStatusCounts.map((item) => item.count),
    1,
  );
  const inventoryHealth =
    stats.totalProducts > 0
      ? Math.round((stats.activeProducts / stats.totalProducts) * 100)
      : 0;
  const cartConversionSignal =
    stats.openCarts > 0
      ? Math.round((stats.pendingOrders / stats.openCarts) * 100)
      : stats.pendingOrders > 0
        ? 100
        : 0;
  const topProducts = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]">
        <article className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-sm">
          <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                  Live overview
                </span>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  {stats.pendingOrders} pending orders
                </span>
              </div>
              <h2 className="font-heading text-4xl font-semibold leading-tight">
                Scentora performance dashboard
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Track catalog health, order movement, customer activity, and open
                carts from one control surface.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <HeroMetric
                  label="Order value"
                  value={formatInr(stats.orderValue)}
                  icon={DollarSign}
                />
                <HeroMetric
                  label="Active catalog"
                  value={`${inventoryHealth}%`}
                  icon={CheckCircle2}
                />
                <HeroMetric
                  label="Cart signal"
                  value={`${cartConversionSignal}%`}
                  icon={ShoppingBag}
                />
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/8 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Order pipeline
                  </p>
                  <p className="mt-1 text-lg font-semibold">Fulfillment flow</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-emerald-300" aria-hidden="true" />
              </div>
              <div className="space-y-3">
                {orderStatusCounts
                  .filter((item) => item.count > 0)
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.status}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{item.status}</span>
                        <span className="text-slate-400">{item.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-emerald-300"
                          style={{
                            width: `${Math.max(
                              8,
                              (item.count / maxOrderStatusCount) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                {orders.length === 0 ? (
                  <p className="rounded-lg bg-white/8 p-3 text-sm text-slate-300">
                    No order data yet.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Inventory scene
            </p>
            <h2 className="font-heading text-2xl font-semibold">Catalog balance</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard icon={Package} label="Products" value={String(stats.totalProducts)} tone="slate" />
            <MetricCard icon={CheckCircle2} label="Active" value={String(stats.activeProducts)} tone="green" />
            <MetricCard icon={AlertTriangle} label="Low Stock" value={String(stats.lowStockProducts)} tone="amber" />
            <MetricCard icon={Mail} label="Subscribers" value={String(stats.subscribers)} tone="blue" />
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Stock map
              </p>
              <h2 className="font-heading text-2xl font-semibold">Product capacity</h2>
            </div>
            <button
              type="button"
              onClick={() => onChangeView("products")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View products
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product) => {
              const maxStock = Math.max(...topProducts.map((item) => item.stock), 1);

              return (
                <div key={product.id}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-semibold">{product.name}</span>
                    <span className="text-slate-500">{product.stock} units</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-950"
                      style={{
                        width: `${Math.max(6, (product.stock / maxStock) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {topProducts.length === 0 ? <EmptyState title="No products found" /> : null}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
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
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <PanelHeader
            eyebrow="Users"
            title="Recent accounts"
            actionLabel="View users"
            onAction={() => onChangeView("users")}
          />
          {recentUsers.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.name || "Unnamed user"}
                    </p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <StatusPill
                    label={user.emailVerifiedAt ? "VERIFIED" : "UNVERIFIED"}
                    tone={user.emailVerifiedAt ? "green" : "warning"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No users found" />
          )}
        </article>

        <article className="rounded-lg border border-slate-200 bg-white shadow-sm">
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

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
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
              label="Short description"
              value={form.description}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, description: value }))
              }
              className="md:col-span-2"
              required
            />
            <TextAreaField
              label="Detailed description"
              value={form.detailedDescription}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, detailedDescription: value }))
              }
              className="md:col-span-2"
              placeholder="Write 5-6 lines for the product detail page."
            />
            <TextAreaField
              label="Professional detail HTML"
              value={form.productDetailHtml}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, productDetailHtml: value }))
              }
              className="md:col-span-2"
              placeholder="<p><b>Features</b></p><ul><li>Long-lasting amber warmth</li><li>Smooth vanilla finish</li></ul>"
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
              label="Smell options"
              value={form.scentOptions}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, scentOptions: value }))
              }
              placeholder="Amber, Vanilla, Sandalwood"
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
                <th className="px-5 py-3 font-semibold">Payment</th>
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
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {order.statusHistory.length > 0 ? (
                        order.statusHistory.map((entry) => (
                          <span
                            key={entry.id}
                            title={`${entry.note || entry.status} - ${formatDate(
                              entry.createdAt,
                            )}`}
                            className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600"
                          >
                            {entry.status}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                          {order.status}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-semibold">{order.customerName || "N/A"}</div>
                    <div className="text-xs text-slate-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id}>
                          <span className="font-medium">
                            {item.quantity} x {item.name}
                          </span>
                          {item.scentOption ? (
                            <span className="ml-1 text-xs font-semibold text-slate-500">
                              ({item.scentOption})
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-semibold">
                    {formatInr(order.totalAmount)}
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-slate-600">
                    {formatPaymentMethod(order.paymentMethod)}
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
                        <td className="px-4 py-3 font-medium">
                          {item.name}
                          {item.scentOption ? (
                            <span className="ml-1 text-xs font-semibold text-slate-500">
                              ({item.scentOption})
                            </span>
                          ) : null}
                        </td>
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

function BestSellerView({
  settings,
  saving,
  evaluating,
  onChange,
  onSave,
  onEvaluate,
}: {
  settings: BestSellerSettings;
  saving: boolean;
  evaluating: boolean;
  onChange: Dispatch<SetStateAction<BestSellerSettings>>;
  onSave: (settings: BestSellerSettings) => void;
  onEvaluate: () => void;
}) {
  function toggleProduct(
    productId: string,
    key: "isBestSeller" | "isFeatured",
    checked: boolean,
  ) {
    onChange((prev) => ({
      mode: "manual",
      products: prev.products.map((product) =>
        product.id === productId ? { ...product, [key]: checked } : product,
      ),
    }));
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Sales automation
          </p>
          <h2 className="font-heading text-3xl font-semibold">
            Best sellers & trending
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Auto mode evaluates monthly sales. Manual mode lets you customize.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEvaluate}
            disabled={evaluating}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {evaluating ? "Evaluating..." : "Run auto now"}
          </button>
          <button
            type="button"
            onClick={() => onSave(settings)}
            disabled={saving}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save manual changes"}
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-wrap gap-3">
          <ToggleField
            label="Auto monthly mode"
            checked={settings.mode === "auto"}
            onChange={(checked) =>
              onChange((prev) => ({
                ...prev,
                mode: checked ? "auto" : "manual",
              }))
            }
          />
          <StatusPill
            label={settings.mode === "auto" ? "AUTO" : "MANUAL"}
            tone={settings.mode === "auto" ? "green" : "warning"}
          />
        </div>
      </div>

      {settings.products.length > 0 ? (
        <div className="max-h-[calc(100vh-260px)] overflow-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Month sold</th>
                <th className="px-5 py-3 font-semibold">30-day sold</th>
                <th className="px-5 py-3 font-semibold">Total sold</th>
                <th className="px-5 py-3 font-semibold">Best seller</th>
                <th className="px-5 py-3 font-semibold">Trending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settings.products.map((product) => (
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
                        <p className="truncate text-xs text-slate-500">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-semibold">
                    {product.metrics.monthlySold}
                  </td>
                  <td className="px-5 py-3 font-semibold">
                    {product.metrics.trendingSold}
                  </td>
                  <td className="px-5 py-3 font-semibold">
                    {product.metrics.totalSold}
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={product.isBestSeller}
                      onChange={(event) =>
                        toggleProduct(product.id, "isBestSeller", event.target.checked)
                      }
                      className="h-4 w-4 accent-slate-950"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={product.isFeatured}
                      onChange={(event) =>
                        toggleProduct(product.id, "isFeatured", event.target.checked)
                      }
                      className="h-4 w-4 accent-slate-950"
                    />
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

function ContactInquiriesView({ inquiries }: { inquiries: ContactInquiry[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Customer messages
        </p>
        <h2 className="font-heading text-3xl font-semibold">Contact inquiries</h2>
      </div>

      {inquiries.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <h3 className="font-heading text-xl font-semibold">
                    {inquiry.subject}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span>{inquiry.name}</span>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="font-medium text-slate-700 hover:opacity-70"
                    >
                      {inquiry.email}
                    </a>
                    {inquiry.phone ? (
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="font-medium text-slate-700 hover:opacity-70"
                      >
                        {inquiry.phone}
                      </a>
                    ) : null}
                  </div>
                </div>
                <p className="shrink-0 text-sm text-slate-500">
                  {formatDateTime(inquiry.createdAt)}
                </p>
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {inquiry.message}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No contact inquiries found" />
      )}
    </section>
  );
}

function NewsletterSubscribersView({
  subscribers,
}: {
  subscribers: NewsletterSubscriber[];
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Newsletter
        </p>
        <h2 className="font-heading text-3xl font-semibold">Subscribers</h2>
      </div>

      {subscribers.length > 0 ? (
        <div className="max-h-[calc(100vh-220px)] overflow-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3">
                    <a
                      href={`mailto:${subscriber.email}`}
                      className="font-medium text-slate-800 hover:opacity-70"
                    >
                      {subscriber.email}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {formatDateTime(subscriber.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No newsletter subscribers found" />
      )}
    </section>
  );
}

function UsersView({
  users,
  onViewOrders,
}: {
  users: AdminCustomer[];
  onViewOrders: (user: AdminCustomer) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Accounts
        </p>
        <h2 className="font-heading text-3xl font-semibold">Users</h2>
      </div>

      {users.length > 0 ? (
        <div className="max-h-[calc(100vh-220px)] overflow-auto">
          <table className="w-full min-w-[1320px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Verification</th>
                <th className="px-5 py-3 font-semibold">Sessions</th>
                <th className="px-5 py-3 font-semibold">Orders</th>
                <th className="px-5 py-3 font-semibold">Spent</th>
                <th className="px-5 py-3 font-semibold">Cart</th>
                <th className="px-5 py-3 font-semibold">Last Login</th>
                <th className="px-5 py-3 font-semibold">Last Seen</th>
                <th className="px-5 py-3 font-semibold">Created</th>
                <th className="px-5 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3">
                    <div className="font-semibold">{user.name || "Unnamed user"}</div>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-xs font-medium text-slate-600 hover:opacity-70"
                    >
                      {user.email}
                    </a>
                    <div className="mt-1 font-mono text-[11px] text-slate-400">
                      {user.id}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill
                      label={user.role}
                      tone={user.role === "ADMIN" ? "blue" : "neutral"}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill
                      label={user.emailVerifiedAt ? "VERIFIED" : "UNVERIFIED"}
                      tone={user.emailVerifiedAt ? "green" : "warning"}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      {user.emailVerifiedAt ? formatDateTime(user.emailVerifiedAt) : "N/A"}
                    </p>
                  </td>
                  <td className="px-5 py-3 font-medium">
                    {user.activeSessionCount}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      className="rounded-md text-left font-medium text-blue-700 underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
                      disabled={user.orderCount === 0}
                      title={
                        user.orderCount > 0
                          ? `View orders for ${user.email}`
                          : "No orders for this user"
                      }
                      onClick={() => onViewOrders(user)}
                    >
                      {user.orderCount}
                    </button>
                    <p className="text-xs text-slate-500">
                      Last: {user.lastOrderAt ? formatDate(user.lastOrderAt) : "N/A"}
                    </p>
                  </td>
                  <td className="px-5 py-3 font-semibold">
                    {formatInr(user.totalSpent)}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium">
                      {user.cartQuantity} qty / {user.cartItemCount} lines
                    </p>
                    <p className="text-xs text-slate-500">
                      {user.lastCartUpdatedAt
                        ? formatDate(user.lastCartUpdatedAt)
                        : "No cart"}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "N/A"}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {user.lastSeenAt ? formatDateTime(user.lastSeenAt) : "N/A"}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {formatDateTime(user.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {formatDateTime(user.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No users found" />
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
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <div className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${toneClass}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-normal">{value}</p>
    </article>
  );
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/8 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          {label}
        </span>
        <Icon className="h-4 w-4 text-emerald-300" aria-hidden="true" />
      </div>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
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

function SettingsView({
  settings,
  savingSettings,
  onChange,
  onSave,
}: {
  settings: SiteSettings;
  savingSettings: boolean;
  onChange: Dispatch<SetStateAction<SiteSettings>>;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Storefront
        </p>
        <h2 className="font-heading text-3xl font-semibold">Site settings</h2>
      </div>

      <form onSubmit={onSave} className="space-y-5">
        <TextAreaField
          label="Promotional line"
          value={settings.promoBannerText}
          onChange={(value) =>
            onChange((prev) => ({ ...prev, promoBannerText: value }))
          }
          required
        />

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Preview
          </p>
          <div className="bg-[#1A1A1A] px-4 py-2 text-center text-sm font-medium text-white">
            {settings.promoBannerText ||
              "Free Shipping on Orders over 30KWD - Arrives Next Day From 5 to 9 PM"}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Call phone number"
            value={settings.contactPhone}
            onChange={(value) =>
              onChange((prev) => ({ ...prev, contactPhone: value }))
            }
            placeholder="+96500000000"
          />
          <InputField
            label="Email address"
            value={settings.contactEmail}
            onChange={(value) =>
              onChange((prev) => ({ ...prev, contactEmail: value }))
            }
            placeholder="support@scentora.com"
          />
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Footer social links
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Facebook URL"
              value={settings.facebookUrl}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, facebookUrl: value }))
              }
              placeholder="https://facebook.com/your-page"
            />
            <InputField
              label="X URL"
              value={settings.xUrl}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, xUrl: value }))
              }
              placeholder="https://x.com/your-handle"
            />
            <InputField
              label="YouTube URL"
              value={settings.youtubeUrl}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, youtubeUrl: value }))
              }
              placeholder="https://youtube.com/@your-channel"
            />
            <InputField
              label="Instagram URL"
              value={settings.instagramUrl}
              onChange={(value) =>
                onChange((prev) => ({ ...prev, instagramUrl: value }))
              }
              placeholder="https://instagram.com/your-handle"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingSettings}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingSettings ? "Saving..." : "Save settings"}
        </button>
      </form>
    </section>
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
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
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

  if (["CONFIRMED", "PAID", "PROCESSING"].includes(status)) {
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatPaymentMethod(value: string) {
  return value === "CASH_ON_DELIVERY" ? "Cash on Delivery" : value;
}
