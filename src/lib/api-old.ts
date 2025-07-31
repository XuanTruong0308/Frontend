const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Types
export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "partner" | "admin";
  avatar?: string;
  phone?: string;
  address?: string;
  gender?: string;
  birthdate?: string;
  isDisabled: boolean;
  updatedProfile: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: number;
  name: string;
  email?: string;
  description?: string;
  location?: string;
  phone?: string;
  website?: string;
  workingHours?: string;
  avatar?: string;
  isPremium: boolean;
  premiumExpiresAt?: string | null;
  rating: number;
  totalRatings: number;
  avg_rating: number;
  totalBookings: number;
  userId: number;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  imageMain?: string;
  images?: string;
  mainImage?: string;
  location?: string;
  isHighlighted: boolean;
  isActive: boolean;
  partner?: Partner;
  partnerId?: number;
  partnerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceData {
  name: string;
  description: string;
  price: number;
  location: string;
  mainImage: string;
  images: string[];
  category?: string;
  duration?: number;
}

export interface ChatMessage {
  id: number;
  content: string;
  imageUrl?: string;
  senderId: number;
  senderName: string;
  senderRole: "partner" | "user" | "admin";
  timestamp: string;
  conversationId: number;
}

export interface ChatConversation {
  id: number;
  participantName: string;
  participantRole: "user" | "admin";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface AdminBooking {
  id: number;
  date: string;
  time: string;
  status: string;
  price: number;
  notes?: string;
  user?: User;
  userId: number;
  userName?: string;
  service?: Service;
  serviceId: number;
  serviceName?: string;
  partner?: Partner;
  partnerId: number;
  partnerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  userId: number;
  serviceId: number;
  serviceName?: string;
  date: string;
  time: string;
  price: number;
  status: "booked" | "paid" | "completed";
  createdAt: string;
  user?: User;
  service?: Service;
}

export interface Payment {
  id: number;
  bookingId?: number;
  amount: number;
  method?: string;
  description?: string;
  date?: string;
  status: "paid" | "pending";
  createdAt: string;
  booking?: Booking;
}

export type AdminUser = User;

export interface AdminPayment extends Payment {
  userName?: string;
  partnerName?: string;
  paymentMethod?: string;
}

export interface AdminService extends Service {
  partnerName?: string;
}

export interface ComprehensiveStats {
  users: {
    total: number;
    currentMonth: number;
    previousMonth: number;
    percentChange: number;
    trend: Array<{ month: number; year: number; count: string }>;
  };
  partners: {
    total: number;
    currentMonth: number;
    previousMonth: number;
    percentChange: number;
    trend: Array<{ month: number; year: number; count: string }>;
  };
  bookings: {
    total: number;
    currentMonth: number;
    previousMonth: number;
    percentChange: number;
    trend: Array<{ month: number; year: number; count: string }>;
  };
  revenue: {
    total: number;
    currentMonth: number;
    previousMonth: number;
    percentChange: number;
    trend: Array<{ month: number; year: number; count: string }>;
  };
  featuredServices: Array<{
    id: number;
    name: string;
    category: string;
    partnerName: string;
    price: string;
    bookingCount: string;
  }>;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  },

  register: async (email: string, password: string, fullName: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, fullName }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  },

  getProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get profile");
    }

    return response.json();
  },

  logout: () => {
    // Simply return a resolved promise for logout
    return Promise.resolve({ message: "Logged out successfully" });
  },
};

// Partner API
export const partnerApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/partners`);

    if (!response.ok) {
      throw new Error("Failed to get partners");
    }

    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/partners/${id}`);

    if (!response.ok) {
      throw new Error("Failed to get partner");
    }

    return response.json();
  },

  getProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/partners/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get partner profile");
    }

    return response.json();
  },

  createProfile: async (token: string, profileData: Partial<Partner>) => {
    const response = await fetch(`${API_BASE_URL}/partners/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to create partner profile");
    }

    return response.json();
  },

  updateProfile: async (token: string, profileData: Partial<Partner>) => {
    const response = await fetch(`${API_BASE_URL}/partners/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update partner profile");
    }

    return response.json();
  },

  upgradeToPremium: async (token: string, months: number) => {
    const response = await fetch(`${API_BASE_URL}/partners/premium/upgrade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ months }),
    });

    if (!response.ok) {
      throw new Error("Failed to upgrade to premium");
    }

    return response.json();
  },

  getPremiumStatus: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/partners/premium/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get premium status");
    }

    return response.json();
  },

  ratePartner: async (token: string, partnerId: number, rating: number) => {
    const response = await fetch(
      `${API_BASE_URL}/partners/${partnerId}/rating`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to rate partner");
    }

    return response.json();
  },

  updatePartner: async (
    token: string,
    partnerId: number,
    partnerData: Partial<Partner>,
  ) => {
    const response = await fetch(`${API_BASE_URL}/partners/${partnerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(partnerData),
    });

    if (!response.ok) {
      throw new Error("Failed to update partner");
    }

    return response.json();
  },

  updatePartnerAvatar: async (
    token: string,
    partnerId: number,
    formData: FormData,
  ) => {
    const response = await fetch(
      `${API_BASE_URL}/partners/${partnerId}/avatar`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update partner avatar");
    }

    return response.json();
  },
};

// Service API for partners
export const serviceApi = {
  getPartnerServices: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/services/partner`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get partner services");
    }

    return response.json();
  },

  create: async (token: string, serviceData: CreateServiceData) => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error("Failed to create service");
    }

    return response.json();
  },

  update: async (
    token: string,
    serviceId: number,
    serviceData: Partial<CreateServiceData>,
  ) => {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error("Failed to update service");
    }

    return response.json();
  },

  delete: async (token: string, serviceId: number) => {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete service");
    }

    return response.json();
  },
};

// Chat API
export const chatApi = {
  getConversations: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get conversations");
    }

    return response.json();
  },

  getMessages: async (token: string, conversationId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get messages");
    }

    return response.json();
  },

  sendMessage: async (token: string, messageData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/chat/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: messageData,
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response.json();
  },

  createConversation: async (
    token: string,
    participantRole: "admin" | "user",
  ) => {
    const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ participantRole }),
    });

    if (!response.ok) {
      throw new Error("Failed to create conversation");
    }

    return response.json();
  },

  markAsRead: async (token: string, conversationId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/chat/conversations/${conversationId}/read`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to mark as read");
    }

    return response.json();
  },
};

// Services API
export const servicesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/services`);

    if (!response.ok) {
      throw new Error("Failed to get services");
    }

    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);

    if (!response.ok) {
      throw new Error("Failed to get service");
    }

    return response.json();
  },

  getByPartnerId: async (partnerId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/services/partner/${partnerId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to get services by partner");
    }

    return response.json();
  },

  getHighlighted: async () => {
    const response = await fetch(`${API_BASE_URL}/services/highlighted`);

    if (!response.ok) {
      throw new Error("Failed to get highlighted services");
    }

    return response.json();
  },
};

// Contact API
export const contactApi = {
  sendMessage: async (contactData: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response.json();
  },
};

// Users API
export const usersApi = {
  getProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user profile");
    }

    return response.json();
  },

  updateProfile: async (token: string, profileData: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    return response.json();
  },

  updateAvatar: async (formData: FormData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update avatar");
    }

    return response.json();
  },
};

// Bookings API
export const bookingsApi = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get bookings");
    }

    return response.json();
  },

  getById: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get booking");
    }

    return response.json();
  },

  create: async (token: string, bookingData: Partial<Booking>) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error("Failed to create booking");
    }

    return response.json();
  },

  getMyBookings: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get my bookings");
    }

    return response.json();
  },
};

// Payments API
export const paymentsApi = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get payments");
    }

    return response.json();
  },

  getById: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get payment");
    }

    return response.json();
  },

  create: async (token: string, paymentData: Partial<Payment>) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment");
    }

    return response.json();
  },

  getMyPayments: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get my payments");
    }

    return response.json();
  },
};

// Admin API
export const adminApi = {
  getUsers: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get users");
    }

    return response.json();
  },

  getUserById: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    return response.json();
  },

  getAllBookings: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get bookings");
    }

    return response.json();
  },

  updateUser: async (token: string, id: number, userData: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return response.json();
  },

  deleteUser: async (token: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return response.json();
  },

  getComprehensiveStats: async (token: string) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/statistics/comprehensive`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get comprehensive stats");
    }

    return response.json();
  },

  updateServicePrice: async (
    token: string,
    serviceId: number,
    newPrice: number,
  ) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/services/${serviceId}/price`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: newPrice }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update service price");
    }

    return response.json();
  },

  deleteService: async (token: string, serviceId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/services/${serviceId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete service");
    }

    return response.json();
  },

  getAllPayments: async (
    token: string,
    queryParams?: Record<string, string>,
  ) => {
    const url = new URL(`${API_BASE_URL}/admin/payments`);
    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key]) {
          url.searchParams.append(key, queryParams[key]);
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get payments");
    }

    return response.json();
  },

  getAllServices: async (
    token: string,
    queryParams?: Record<string, string>,
  ) => {
    const url = new URL(`${API_BASE_URL}/admin/services`);
    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key]) {
          url.searchParams.append(key, queryParams[key]);
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get services");
    }

    return response.json();
  },

  createPartnerFromEmail: async (token: string, email: string) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/partners/create-from-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create partner from email");
    }

    return response.json();
  },

  getDashboardStats: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get dashboard stats");
    }

    return response.json();
  },
};
