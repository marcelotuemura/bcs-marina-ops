/**
 * This module defines the TypeScript types for your Supabase database.  
 * Use the `Database` type when creating a Supabase client to get
 * type‑safe results from your queries.  
 *
 * You can generate this automatically by running
 * `npx supabase gen types typescript --project-id <your-id>`
 * but for the sake of this starter we include a minimal definition.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          created_at: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          company_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          company_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          company_id?: string | null;
        };
      };
      vessels: {
        Row: {
          id: string;
          created_at: string;
          name: string | null;
          make: string | null;
          model: string | null;
          year: number | null;
          customer_id: string | null;
          company_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name?: string | null;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          customer_id?: string | null;
          company_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string | null;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          customer_id?: string | null;
          company_id?: string | null;
        };
      };
      estimates: {
        Row: {
          id: string;
          created_at: string;
          title: string | null;
          description: string | null;
          status: string | null;
          total: number | null;
          customer_id: string | null;
          vessel_id: string | null;
          created_by: string | null;
          company_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          status?: string | null;
          total?: number | null;
          customer_id?: string | null;
          vessel_id?: string | null;
          created_by?: string | null;
          company_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          status?: string | null;
          total?: number | null;
          customer_id?: string | null;
          vessel_id?: string | null;
          created_by?: string | null;
          company_id?: string | null;
        };
      };
      invoices: {
        Row: {
          id: string;
          created_at: string;
          title: string | null;
          description: string | null;
          status: string | null;
          total: number | null;
          customer_id: string | null;
          vessel_id: string | null;
          created_by: string | null;
          company_id: string | null;
          estimate_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          status?: string | null;
          total?: number | null;
          customer_id?: string | null;
          vessel_id?: string | null;
          created_by?: string | null;
          company_id?: string | null;
          estimate_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          status?: string | null;
          total?: number | null;
          customer_id?: string | null;
          vessel_id?: string | null;
          created_by?: string | null;
          company_id?: string | null;
          estimate_id?: string | null;
        };
      };
      work_orders: {
        Row: {
          id: string;
          created_at: string;
          title: string | null;
          description: string | null;
          status: string | null;
          technician_id: string | null;
          customer_id: string | null;
          vessel_id: string | null;
          estimate_id: string | null;
          created_by: string | null;
          company_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          status?: string | null;
          technician_id?: string | null;
          customer_id?: string | null;
          vessel_id?: string | null;
          estimate_id?: string | null;
          created_by?: string | null;
          company_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          status?: string | null;
          technician_id?: string | null;
          customer_id?: string | null;
          vessel_id?: string | null;
          estimate_id?: string | null;
          created_by?: string | null;
          company_id?: string | null;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      organization_members: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          organization_id?: string;
          role?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}