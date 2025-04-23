// src/lib/guards/authGuard.js
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { authService } from '$lib/api/authApi';

// Auth guard for protected routes
export async function authGuard({ url }: RequestEvent) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Store the original URL they tried to access
    const redirectTo = url.pathname + url.search;
    throw redirect(302, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }
}

// Redirect if already authenticated (for login/register pages)
export async function unauthenticatedGuard() {
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    throw redirect(302, '/');
  }
}

// Profile guard - check if user has a profile
export async function profileGuard() {
  // First check authentication
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    throw redirect(302, '/login');
  }
  
  try {
    // Try to get user profile
    const profileResponse = await authService.getProfile();
    
    // If we get here, user has a profile, redirect to home
    if (profileResponse) {
      throw redirect(302, '/');
    }
  } catch (error) {
    // If error is 404, user has no profile, allow access
    if (error.response?.status === 404) {
      return;
    }
    
    // Other error, redirect to login
    throw redirect(302, '/login');
  }
}

// Check for specific roles
export function requireRole(requiredRoles) {
  let userData = null;
  
  // Get user data from store
  const unsubscribe = auth.subscribe(value => {
    userData = value.user;
  });
  unsubscribe();
  
  // First check if user is authenticated
  if (!userData) {
    throw redirect(302, '/login');
  }
  
