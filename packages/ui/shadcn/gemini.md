# Description
This is ui package 

# General Instructions

- install shadcn ui libraray
- follw the below instruction
## install 
1. install this pacakge
```
pnpm add class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```
Configure the path aliases in tsconfig.json file.
```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@ui/shadcn/*": ["./*"]
    }
  }
}
```

## component list 
Accordion
Alert
Alert Dialog
Aspect Ratio
Avatar
Badge
Breadcrumb
Button
Button Group
Calendar
Card
Carousel
Chart
Checkbox
Collapsible
Combobox
Command
Context Menu
Data Table
Date Picker
Dialog
Drawer
Dropdown Menu
Empty
Field
React Hook Form
Hover Card
Input
Input Group
Input OTP
Item
Kbd
Label
Menubar
Pagination
Popoer
Progress
Radio Group
Resizable
Scroll Area
Select
Separator
Sheet
Sidebar
Skeleton
Slider
Sonner
Spinner
Switch
Table
Tabs
Textarea
Toast
Toggle
Toggle Group
Tooltip
Typography
## add component 
when add component, use shadcn cli 
```
pnpm dlx shadcn@latest add {component}
```
# task
- define folder structure as mention below
- install badge component 
# structure
- menu
- section
- footer 

