export type GuestWishlistItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  notes?: string;
  tag?: string;
  slug?: string;
};

const GUEST_WISHLIST_KEY = "scentora:guest-wishlist";

export function getGuestWishlist() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(GUEST_WISHLIST_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as GuestWishlistItem[];
    return Array.isArray(parsed) ? parsed.filter(isGuestWishlistItem) : [];
  } catch {
    return [];
  }
}

export function addGuestWishlistItem(item: GuestWishlistItem) {
  const wishlist = getGuestWishlist();

  if (!wishlist.some((wishlistItem) => wishlistItem.productId === item.productId)) {
    wishlist.push(item);
    saveGuestWishlist(wishlist);
    notifyGuestWishlistUpdated();
  }
}

export function removeGuestWishlistItem(productId: string) {
  saveGuestWishlist(
    getGuestWishlist().filter((item) => item.productId !== productId),
  );
  notifyGuestWishlistUpdated();
}

export function isGuestWishlisted(productId: string) {
  return getGuestWishlist().some((item) => item.productId === productId);
}

export function getGuestWishlistQuantity() {
  return getGuestWishlist().length;
}

function saveGuestWishlist(wishlist: GuestWishlistItem[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist));
  }
}

function notifyGuestWishlistUpdated() {
  window.dispatchEvent(new Event("scentora:wishlist-updated"));
}

function isGuestWishlistItem(value: unknown): value is GuestWishlistItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.image === "string" &&
    typeof item.price === "number"
  );
}
