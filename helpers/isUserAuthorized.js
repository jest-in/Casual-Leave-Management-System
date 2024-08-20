export default function isUserAuthorized(allowedRoles, userRole) {
  // If the user is not authorized to use this request
  if (!allowedRoles.includes(userRole)) return false;

  return true;
}
