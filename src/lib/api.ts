// ============================================
// API CONFIGURATION CHO BACKEND MỚI
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// ============================================
// TYPES THEO BACKEND ENTITIES
// ============================================

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  address?: string;
  role: "User" | "Partner" | "Admin";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: number;
  user_id: number;
  company_name: string;
  name?: string;
  email?: string;
  description?: string;
  city?: string;
  location?: string;
  contact_person?: string;
  business_license?: string;
  tax_id?: string;
  bank_account_info?: string;
  is_verified: boolean;
  isPremium?: boolean;
  totalRatings?: number;
  totalBookings?: number;
  avatar?: string;
  phone?: string;
  workingHours?: string;
  avg_rating?: number;
  rating?: number;
  premiumExpiresAt?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Service {
  id: number;
  partner_id: number;
  service_name: string;
  description: string;
  price: number;
  service_type: string;
  duration_minutes: number;
  location?: string;
  mainImage?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  partner?: Partner;
}

export interface Booking {
  id: number;
  user_id: number;
  service_id: number;
  booking_date: string;
  booking_time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  total_price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  service?: Service;
}

export interface Chat {
  id: number;
  sender_id: number;
  receiver_id: number;
  booking_id?: number;
  message_content: string;
  sent_at: string;
  sender?: User;
  receiver?: User;
  booking?: Booking;
}

export interface Message {
  id: number;
  conversationId: string;
  content: string;
  senderId: number;
  senderName: string;
  senderRole: string;
  timestamp: string;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

// ============================================
// AUTH API FUNCTIONS
// ============================================

export const authApi = {
  // Register
  register: async (data: {
    email: string;
    password: string;
    full_name: string;
    phone_number?: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  // Login
  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  // Logout
  logout: (): Promise<void> => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return Promise.resolve();
  },
};

// ============================================
// USERS API FUNCTIONS
// ============================================

export const usersApi = {
  // Get profile
  getProfile: async (token: string): Promise<Omit<User, "password_hash">> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get profile");
    }

    return response.json();
  },

  // Update profile
  updateProfile: async (
    token: string,
    data: {
      full_name?: string;
      phone_number?: string;
      address?: string;
    },
  ): Promise<Omit<User, "password_hash">> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return response.json();
  },
};

// ============================================
// PARTNERS API FUNCTIONS
// ============================================

export const partnersApi = {
  // Register as partner
  register: async (
    token: string,
    data: {
      company_name: string;
      description?: string;
      city?: string;
      contact_person?: string;
    },
  ): Promise<Partner> => {
    const response = await fetch(`${API_BASE_URL}/partners/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Partner registration failed");
    }

    return response.json();
  },

  // Get partner profile
  getProfile: async (token: string): Promise<Partner> => {
    const response = await fetch(`${API_BASE_URL}/partners/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get partner profile");
    }

    return response.json();
  },

  // Update partner profile
  updateProfile: async (
    token: string,
    data: {
      company_name?: string;
      description?: string;
      city?: string;
      contact_person?: string;
    },
  ): Promise<Partner> => {
    const response = await fetch(`${API_BASE_URL}/partners/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update partner profile");
    }

    return response.json();
  },

  // Get all partners (public)
  getAll: async (): Promise<Partner[]> => {
    const response = await fetch(`${API_BASE_URL}/partners`);

    if (!response.ok) {
      throw new Error("Failed to get partners");
    }

    return response.json();
  },

  // Search partners (public)
  search: async (params: {
    city?: string;
    keyword?: string;
  }): Promise<Partner[]> => {
    const searchParams = new URLSearchParams();
    if (params.city) searchParams.append("city", params.city);
    if (params.keyword) searchParams.append("keyword", params.keyword);

    const response = await fetch(
      `${API_BASE_URL}/partners/search?${searchParams}`,
    );

    if (!response.ok) {
      throw new Error("Failed to search partners");
    }

    return response.json();
  },

  // Get partner by ID (public)
  getById: async (id: number): Promise<Partner> => {
    const response = await fetch(`${API_BASE_URL}/partners/${id}`);

    if (!response.ok) {
      throw new Error("Failed to get partner");
    }

    return response.json();
  },

  // Upgrade to premium (Partner only)
  upgradeToPremium: async (token: string, months: number): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/partners/upgrade-premium`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ months }),
    });

    if (!response.ok) {
      throw new Error("Failed to upgrade to premium");
    }

    return response.json();
  },
};

// ============================================
// SERVICES API FUNCTIONS
// ============================================

export const servicesApi = {
  // Get my services (Partner only)
  getPartnerServices: async (token: string): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get partner services");
    }

    return response.json();
  },

  // Create service (Partner only)
  create: async (
    token: string,
    data: {
      service_name: string;
      description: string;
      price: number;
      duration_minutes: number;
      service_type: string;
    },
  ): Promise<Service> => {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create service");
    }

    return response.json();
  },

  // Get my services (Partner only)
  getMy: async (token: string): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services/my-services`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get my services");
    }

    return response.json();
  },

  // Update service (Partner only)
  update: async (
    token: string,
    id: number,
    data: {
      service_name?: string;
      description?: string;
      price?: number;
      duration_minutes?: number;
      service_type?: string;
      is_active?: boolean;
    },
  ): Promise<Service> => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update service");
    }

    return response.json();
  },

  // Delete service (Partner only)
  delete: async (token: string, id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete service");
    }

    return response.json();
  },

  // Get all services (public)
  getAll: async (): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services`);

    if (!response.ok) {
      throw new Error("Failed to get services");
    }

    return response.json();
  },

  // Search services (public)
  search: async (params: {
    service_type?: string;
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
  }): Promise<Service[]> => {
    const searchParams = new URLSearchParams();
    if (params.service_type)
      searchParams.append("service_type", params.service_type);
    if (params.keyword) searchParams.append("keyword", params.keyword);
    if (params.minPrice)
      searchParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      searchParams.append("maxPrice", params.maxPrice.toString());
    if (params.city) searchParams.append("city", params.city);

    const response = await fetch(
      `${API_BASE_URL}/services/search?${searchParams}`,
    );

    if (!response.ok) {
      throw new Error("Failed to search services");
    }

    return response.json();
  },

  // Get service by ID (public)
  getById: async (id: number): Promise<Service> => {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);

    if (!response.ok) {
      throw new Error("Failed to get service");
    }

    return response.json();
  },

  // Get services by partner (public)
  getByPartner: async (partnerId: number): Promise<Service[]> => {
    const response = await fetch(
      `${API_BASE_URL}/services/partner/${partnerId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to get partner services");
    }

    return response.json();
  },
};

// ============================================
// BOOKINGS API FUNCTIONS
// ============================================

export const bookingsApi = {
  // Create booking (User only)
  create: async (
    token: string,
    data: {
      service_id: number;
      booking_date: string;
      notes?: string;
    },
  ): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create booking");
    }

    return response.json();
  },

  // Get my bookings (User only)
  getMy: async (token: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get my bookings");
    }

    return response.json();
  },

  // Get partner bookings (Partner only)
  getPartnerBookings: async (token: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings/partner-bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get partner bookings");
    }

    return response.json();
  },

  // Update booking status (Partner only)
  updateStatus: async (
    token: string,
    id: number,
    data: {
      status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
      notes?: string;
    },
  ): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update booking status");
    }

    return response.json();
  },

  // Cancel booking (User only)
  cancel: async (token: string, id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to cancel booking");
    }

    return response.json();
  },

  // Get booking by ID
  getById: async (token: string, id: number): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get booking");
    }

    return response.json();
  },

  // Get booking statistics (Partner only)
  getStatistics: async (
    token: string,
  ): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
  }> => {
    const response = await fetch(`${API_BASE_URL}/bookings/statistics`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get booking statistics");
    }

    return response.json();
  },
};

// ============================================
// CHATS API FUNCTIONS
// ============================================

export const chatsApi = {
  // Send message
  send: async (
    token: string,
    data: {
      receiver_id: number;
      booking_id?: number;
      message: string;
    },
  ): Promise<Chat> => {
    const response = await fetch(`${API_BASE_URL}/chats/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send message");
    }

    return response.json();
  },

  // Get conversations
  getConversations: async (token: string): Promise<Conversation[]> => {
    const response = await fetch(`${API_BASE_URL}/chats/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get conversations");
    }

    return response.json();
  },

  // Get chat history with user
  getHistory: async (token: string, userId: number): Promise<Chat[]> => {
    const response = await fetch(`${API_BASE_URL}/chats/history/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get chat history");
    }

    return response.json();
  },

  // Get messages in a conversation
  getMessages: async (token: string, conversationId: string): Promise<Chat[]> => {
    const response = await fetch(`${API_BASE_URL}/chats/conversation/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get messages");
    }

    return response.json();
  },

  // Mark conversation as read
  markAsRead: async (token: string, conversationId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/chats/conversation/${conversationId}/read`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark as read");
    }
  },

  // Send message (alias for send method)
  sendMessage: async (
    token: string,
    data: {
      receiver_id: number;
      booking_id?: number;
      message: string;
    },
  ): Promise<Chat> => {
    return chatsApi.send(token, data);
  },

  // Create conversation
  createConversation: async (
    token: string,
    data: {
      participant_id: number;
      booking_id?: number;
    },
  ): Promise<{ id: string }> => {
    const response = await fetch(`${API_BASE_URL}/chats/conversation`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create conversation");
    }

    return response.json();
  },

  // Get booking chats
  getBookingChats: async (
    token: string,
    bookingId: number,
  ): Promise<Chat[]> => {
    const response = await fetch(`${API_BASE_URL}/chats/booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get booking chats");
    }

    return response.json();
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// ============================================
// CONTACT API FUNCTIONS
// ============================================

export const contactApi = {
  // Send contact message
  sendMessage: async (data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<{ message: string }> => {
    // Since contact module doesn't exist in backend yet, simulate success
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Contact message sent:", data);
        resolve({ message: "Tin nhắn đã được gửi thành công!" });
      }, 1000);
    });
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("vi-VN");
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString("vi-VN");
};

// Legacy API exports for backward compatibility
export const adminApi = {
  // Get system statistics
  getStats: async (token: string): Promise<{
    totalUsers: number;
    totalPartners: number;
    totalServices: number;
    totalBookings: number;
  }> => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get admin stats");
    }

    return response.json();
  },

  // Get all users
  getAllUsers: async (token: string): Promise<Omit<User, "password_hash">[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get users");
    }

    return response.json();
  },

  // Ban/unban user
  banUser: async (
    token: string,
    userId: number,
    isBanned: boolean,
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isBanned }),
    });

    if (!response.ok) {
      throw new Error("Failed to ban/unban user");
    }

    return response.json();
  },

  // Get all partners
  getAllPartners: async (token: string): Promise<Partner[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/partners`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get partners");
    }

    return response.json();
  },

  // Promote user to partner
  promoteToPartner: async (
    token: string,
    email: string,
  ): Promise<Partner> => {
    const response = await fetch(`${API_BASE_URL}/admin/partners/promote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to promote user to partner");
    }

    return response.json();
  },

  // Ban partner
  banPartner: async (
    token: string,
    partnerId: number,
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/partners/${partnerId}/ban`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to ban partner");
    }

    return response.json();
  },
};
export const partnerApi = partnersApi; // Old partner API name
export const paymentsApi = {
  getMyPayments: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/payments/my-payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get payments");
    }

    return response.json();
  },
};
