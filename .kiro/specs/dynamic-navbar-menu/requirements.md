# Requirements Document

## Introduction

Fitur Dynamic Navbar Menu memungkinkan admin website sekolah untuk mengelola menu navigasi secara fleksibel melalui panel admin. Menu yang ditampilkan di navbar frontend akan diambil langsung dari database, sehingga perubahan menu tidak memerlukan modifikasi kode. Fitur ini mendukung menu utama (parent) dan sub-menu (dropdown), pengaturan urutan, status aktif/nonaktif, ikon, dan target link.

## Glossary

- **Menu_Manager**: Sistem yang mengelola data menu navigasi di panel admin
- **Navbar_Renderer**: Komponen frontend yang merender navbar berdasarkan data dari database
- **Menu_Item**: Satu entri menu yang memiliki label, URL, urutan, status, ikon, dan target
- **Parent_Menu**: Menu utama yang tampil langsung di navbar (parent_id = NULL)
- **Sub_Menu**: Menu turunan yang tampil sebagai dropdown di bawah parent menu (parent_id != NULL)
- **Admin**: Pengguna yang memiliki akses ke panel admin (/admin)
- **Visitor**: Pengguna yang mengakses halaman frontend website sekolah

## Requirements

### Requirement 1: Struktur Data Menu Navigasi

**User Story:** As an admin, I want a dedicated database table for navigation menus, so that menu data is stored persistently and can be managed independently from the codebase.

#### Acceptance Criteria

1. THE Menu_Manager SHALL store menu items in a table named `menu_navigasi` with columns: id, label, url, parent_id, urutan, status, icon, target, created_at
2. THE Menu_Manager SHALL enforce that `label` is a non-empty string with maximum 100 characters
3. THE Menu_Manager SHALL enforce that `url` is a non-empty string with maximum 255 characters
4. THE Menu_Manager SHALL enforce that `status` only accepts values 'aktif' or 'nonaktif', defaulting to 'aktif'
5. THE Menu_Manager SHALL enforce that `target` only accepts values '_self' or '_blank', defaulting to '_self'
6. THE Menu_Manager SHALL allow `parent_id` to be NULL for parent menus and reference a valid menu id for sub-menus
7. THE Menu_Manager SHALL allow `icon` to be NULL or a Font Awesome class string with maximum 100 characters

### Requirement 2: Tambah Menu

**User Story:** As an admin, I want to add new menu items (parent or sub-menu), so that I can expand the navigation structure of the website.

#### Acceptance Criteria

1. WHEN an admin submits the create menu form with valid data, THE Menu_Manager SHALL insert a new record into `menu_navigasi` and redirect to the menu list page
2. WHEN an admin submits the create menu form with an empty label, THE Menu_Manager SHALL reject the submission and display a validation error message
3. WHEN an admin submits the create menu form with an empty URL, THE Menu_Manager SHALL reject the submission and display a validation error message
4. WHEN an admin creates a sub-menu, THE Menu_Manager SHALL associate the sub-menu with a valid parent_id from existing parent menus
5. THE Menu_Manager SHALL provide a dropdown list of all existing parent menus when creating a sub-menu

### Requirement 3: Edit Menu

**User Story:** As an admin, I want to edit existing menu items, so that I can update labels, URLs, order, and other properties without deleting and recreating menus.

#### Acceptance Criteria

1. WHEN an admin submits the edit menu form with valid data, THE Menu_Manager SHALL update the corresponding record in `menu_navigasi` and redirect to the menu list page
2. WHEN an admin submits the edit menu form with an empty label, THE Menu_Manager SHALL reject the submission and display a validation error message
3. WHEN an admin submits the edit menu form with an empty URL, THE Menu_Manager SHALL reject the submission and display a validation error message
4. WHEN an admin requests the edit page for a non-existent menu id, THE Menu_Manager SHALL redirect to the menu list page with an error message

### Requirement 4: Hapus Menu

**User Story:** As an admin, I want to delete menu items, so that I can remove outdated or unnecessary navigation links.

#### Acceptance Criteria

1. WHEN an admin deletes a parent menu that has sub-menus, THE Menu_Manager SHALL also delete all associated sub-menus (cascade delete)
2. WHEN an admin deletes a menu item, THE Menu_Manager SHALL remove the record from `menu_navigasi` and redirect to the menu list page with a success message
3. WHEN an admin attempts to delete a non-existent menu id, THE Menu_Manager SHALL redirect to the menu list page with an error message

### Requirement 5: Aktif/Nonaktif Menu

**User Story:** As an admin, I want to toggle the active/inactive status of menu items, so that I can temporarily hide menus without deleting them.

#### Acceptance Criteria

1. WHEN an admin toggles the status of a menu item, THE Menu_Manager SHALL update the `status` field between 'aktif' and 'nonaktif' and return a success response
2. WHEN a parent menu has status 'nonaktif', THE Navbar_Renderer SHALL NOT display that parent menu or any of its sub-menus on the frontend
3. WHEN a sub-menu has status 'nonaktif', THE Navbar_Renderer SHALL NOT display that sub-menu in the dropdown, but SHALL still display the parent menu if it has other active sub-menus or is itself active

### Requirement 6: Daftar Menu di Admin

**User Story:** As an admin, I want to see a list of all menu items with their hierarchy, so that I can manage the navigation structure at a glance.

#### Acceptance Criteria

1. WHEN an admin visits /admin/menu, THE Menu_Manager SHALL display all menu items ordered by urutan ASC
2. THE Menu_Manager SHALL display parent menus and their sub-menus in a hierarchical view
3. THE Menu_Manager SHALL display each menu item's label, url, urutan, status, icon, and target in the list
4. THE Menu_Manager SHALL provide action buttons for edit, delete, and toggle status for each menu item

### Requirement 7: Navbar Frontend Dinamis

**User Story:** As a visitor, I want the website navbar to reflect the current menu configuration, so that I always see up-to-date navigation links.

#### Acceptance Criteria

1. WHEN a visitor loads any frontend page, THE Navbar_Renderer SHALL fetch all menu items with status 'aktif' from `menu_navigasi` ordered by urutan ASC
2. WHEN a parent menu has active sub-menus, THE Navbar_Renderer SHALL render that menu item as a Bootstrap 5 dropdown
3. WHEN a visitor hovers over a parent menu with sub-menus on desktop, THE Navbar_Renderer SHALL display the dropdown menu
4. WHEN a parent menu has no active sub-menus, THE Navbar_Renderer SHALL render it as a plain navigation link
5. WHEN a menu item has `target = '_blank'`, THE Navbar_Renderer SHALL open the link in a new browser tab
6. WHEN a menu item has an icon value, THE Navbar_Renderer SHALL display the Font Awesome icon before the menu label
7. WHEN no active menu items exist in the database, THE Navbar_Renderer SHALL display an empty navbar without errors

### Requirement 8: Integrasi Frontend Controller

**User Story:** As a developer, I want the frontend controller to automatically load menu data for all pages, so that the dynamic navbar works consistently across the entire website.

#### Acceptance Criteria

1. THE Navbar_Renderer SHALL load menu data once per request using a shared helper function in frontendController.js
2. WHEN a database error occurs while loading menu data, THE Navbar_Renderer SHALL fall back to an empty menu array and log the error, without crashing the page
3. THE Navbar_Renderer SHALL pass menu data as a variable named `menuItems` to all frontend EJS views

### Requirement 9: Migrasi Database

**User Story:** As a developer, I want a migration script to create the menu_navigasi table and seed default data, so that the feature can be set up consistently across environments.

#### Acceptance Criteria

1. THE Menu_Manager SHALL provide a script `create_menu_navigasi_table.js` that creates the `menu_navigasi` table if it does not already exist
2. WHEN the migration script is run, THE Menu_Manager SHALL insert default menu items: Beranda, Profil, Berita, Galeri, Guru, Media Sosial, Kontak
3. WHEN the migration script is run, THE Menu_Manager SHALL insert default sub-menus under Profil: Visi & Misi, Sejarah Sekolah, Guru & Karyawan, Sambutan Kepala Sekolah
4. WHEN the migration script is run on a database where the table already exists, THE Menu_Manager SHALL skip table creation without throwing an error
