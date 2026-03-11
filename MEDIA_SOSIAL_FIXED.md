# Media Sosial Feature - Fixed

## Problem
Error: Failed to lookup view "admin/media-sosial/index" in views directory

## Root Cause
File view menggunakan format yang salah. View admin harus menggunakan format HTML lengkap dengan include untuk sidebar, topbar, dan footer, bukan menggunakan layout wrapper.

## Solution
Memperbaiki semua file view admin media sosial dengan format yang benar:

### Files Fixed:
1. `views/admin/media-sosial/index.ejs` - Halaman daftar media sosial
2. `views/admin/media-sosial/create.ejs` - Form tambah media sosial
3. `views/admin/media-sosial/edit.ejs` - Form edit media sosial

### Format yang Benar:
```html
<!DOCTYPE html>
<html lang="id">
<head>
    <!-- Head content -->
</head>
<body id="page-top">
    <div id="wrapper">
        <%- include('../partials/sidebar') %>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <%- include('../partials/topbar', { user }) %>
                <div class="container-fluid">
                    <!-- Page content -->
                </div>
            </div>
            <%- include('../partials/footer') %>
        </div>
    </div>
    <!-- Scripts -->
</body>
</html>
```

## Status
✅ Fixed - All admin media sosial pages now working correctly

## Testing
- URL: http://localhost:3000/admin/media-sosial
- Status: 200 OK
- All CRUD operations working

## Features Working:
- ✅ List media sosial
- ✅ Create new media sosial
- ✅ Edit media sosial
- ✅ Delete media sosial
- ✅ DataTables integration
- ✅ Modal confirmation for delete
- ✅ Platform-specific URL guidance