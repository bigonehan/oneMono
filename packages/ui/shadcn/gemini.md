# Description
This is ui package 

# General Instructions

- create web component using shadcn ui with react 
- refer to the goal list, make ui component 
- at first, define goal list and find the shadcn component, and find out if they can combine and make new one 
- after build custom component refer to the folder guide, and place the component 
- consider evenry component content will be dynamic, it mean they get items list at a consrtuction time  
- after complete to build component, check the path alias is correctly set
```
import { cn } from "@utils/cn/cn"
```
 - every component should place on /components/ "appropriate folder"
 - some component require to have specify domain(some button, image, etc..)
 - so before build compoent, check the componet domain list and follow the rule 
 - if you not find appropriate folder, place the etc folder 
 - every component must be responsive, is work on the mobile, pc , tablet using tailwind4 make compoent responsive 
 - every component has dark theme variation add prefix `dark:` for darkmode style 
 - every compoent use color system, it mena they uses ` --color-primary` , ` --color-secondary` , `--color-brand` 
## Component List 
- header
- footer
- sidebar
- section
- button
- testimonial section
- faeture  section
- event window
- hero section
- subject button
- cancel button
- search button
- login / signup button
- notification  window
- footer
- modal window
- toast window
- loading spinner
- form :
## folder structure
- header
- footer
- Sidebar
- section 
- feature 
- dialogue
- hero 
- button
- testimonial 
- etc
## component Domain list 
### footer 
- company info
- copyright
- terms of Service 
- privacy poilicy
- sns
- sitemap
- contact
### window Pane
- modal 
- toast 
- loading spinner
- form 
### button
- subject
- cancel
- search
- login / signup
- notification
### section
- testimonial
- faeture 
- event
- hero

## install 
1. install this pacakge
```
pnpm dlx shadcn@latest add {component list}
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

# Troubleshooting

## shadcn/cli path alias issue

When using `pnpm dlx shadcn@latest add`, the CLI might create a `@ui` directory in the root of the `shadcn` package due to a misconfiguration of path aliases in `tsconfig.json`.

**Symptom:** The command claims to create a component, but it doesn't appear in the `components/ui` directory. Instead, a new `@ui` directory is created.

**Fix:**

1.  **Verify:** Check for the existence of a `@ui` directory in the `packages/ui/shadcn` directory.
2.  **Move:** If it exists, move the components from `packages/ui/shadcn/@ui/shadcn/components/ui` to `packages/ui/shadcn/components/ui`.
3.  **Clean:** Remove the now-empty `packages/ui/shadcn/@ui` directory.

Example commands:
```bash
mv packages/ui/shadcn/@ui/shadcn/components/ui/* packages/ui/shadcn/components/ui/
rm -rf packages/ui/shadcn/@ui
```

### Recurring Path Issue

If the path issue (`components/components/...`) occurs multiple times (3 or more), adopt the following workflow:

1.  **Create a temporary directory:** `mkdir temp_component`
2.  **Install the component into the temporary directory:** `pnpm dlx shadcn@latest add my-component --path temp_component`
3.  **Move the component:** `mv temp_component/my-component.tsx components/ui/`
4.  **Remove the temporary directory:** `rm -rf temp_component`

This ensures the component is placed in the correct directory without the nested path issue.
