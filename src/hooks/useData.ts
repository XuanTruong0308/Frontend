// ============================================
// HOOKS CHO DATA FETCHING
// ============================================

"use client";

import { useState, useEffect } from "react";
import { servicesApi, partnersApi,  Service, Partner, Booking } from "@/lib/api";

// ============================================
// TYPES
// ============================================

interface BookingStatistics {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

// ============================================
// SERVICES HOOKS
// ============================================

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await servicesApi.getAll();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch services",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const searchServices = async (params: {
    service_type?: string;
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await servicesApi.search(params);
      setServices(data);
    } catch (err) {
      console.error("Error searching services:", err);
      setError(
        err instanceof Error ? err.message : "Failed to search services",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    loading,
    error,
    searchServices,
    refetch: () => {
      setServices([]);
      setLoading(true);
      setError(null);
    },
  };
}

export function useServicesByPartner(partnerId: number) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!partnerId) return;

    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await servicesApi.getByPartner(partnerId);
        setServices(data);
      } catch (err) {
        console.error("Error fetching partner services:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch partner services",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [partnerId]);

  return { services, loading, error };
}

export function useService(id: number) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        const data = await servicesApi.getById(id);
        setService(data);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch service",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return { service, loading, error };
}

// ============================================
// PARTNERS HOOKS
// ============================================

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const data = await partnersApi.getAll();
        setPartners(data);
      } catch (err) {
        console.error("Error fetching partners:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch partners",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const searchPartners = async (params: {
    city?: string;
    keyword?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await partnersApi.search(params);
      setPartners(data);
    } catch (err) {
      console.error("Error searching partners:", err);
      setError(
        err instanceof Error ? err.message : "Failed to search partners",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    partners,
    loading,
    error,
    searchPartners,
    refetch: () => {
      setPartners([]);
      setLoading(true);
      setError(null);
    },
  };
}

export function usePartner(id: number) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPartner = async () => {
      try {
        setLoading(true);
        const data = await partnersApi.getById(id);
        setPartner(data);
      } catch (err) {
        console.error("Error fetching partner:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch partner",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  return { partner, loading, error };
}

// ============================================
// BOOKINGS HOOKS (requires auth)
// ============================================

export function useMyBookings(token: string | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { bookingsApi } = await import("@/lib/api");
        const data = await bookingsApi.getMy(token);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch bookings",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  return { bookings, loading, error };
}

export function usePartnerBookings(token: string | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { bookingsApi } = await import("@/lib/api");
        const data = await bookingsApi.getPartnerBookings(token);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching partner bookings:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch partner bookings",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  return { bookings, loading, error };
}

// ============================================
// STATISTICS HOOKS
// ============================================

export function useBookingStatistics(token: string | null) {
  const [stats, setStats] = useState<BookingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const { bookingsApi } = await import("@/lib/api");
        const data = await bookingsApi.getStatistics(token);
        setStats(data);
      } catch (err) {
        console.error("Error fetching booking statistics:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch statistics",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return { stats, loading, error };
}

// ============================================
// UTILITY HOOKS
// ============================================

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
