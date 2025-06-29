// types/room.ts
export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface RoomType {
    id: string;
    name: string;
    isActive: boolean;
    createdBy: {
      id: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Room {
    id: string;
    name: string;
    roomNumber: string;
    roomType: {
      id: string;
      name: string;
    };
    branch: {
      id: string;
      name: string;
    };
    status: 'available' | 'occupied' | 'maintenance';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateRoomRequest {
    name: string;
    roomNumber: string;
    roomTypeId: string;
    branchId: string;
  }
  
  export interface UpdateRoomRequest {
    name?: string;
    roomNumber?: string;
    roomTypeId?: string;
    status?: 'available' | 'occupied' | 'maintenance';
    isActive?: boolean;
  }
  
  export interface RoomTypesResponse {
    status: string;
    results: number;
    pagination: Pagination;
    data: {
      roomTypes: RoomType[];
    };
  }
  
  export interface RoomResponse {
    status: string;
    data: {
      room: Room;
    };
  }
  
  export interface RoomsResponse {
    status: string;
    results: number;
    pagination: Pagination;
    data: {
      rooms: Room[];
    };
  }
  
  // Request params for fetching rooms
  export interface RoomParams {
    page?: number;
    limit?: number;
    search?: string;
    branchId?: string;
    roomTypeId?: string;
    status?: string;
  }