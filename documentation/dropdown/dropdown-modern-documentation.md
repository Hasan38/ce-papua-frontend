### Modern Dropdown

If you add in some specific markup, `<VDropdown />` buttons can
be enhanced into modern dropdowns with an animated caret icon.
Use the `modern` prop on the component.

<!--code-->

```vue
<template>
  <VDropdown title="Modern dropdown" modern>
    <template #content>
      <a href="#" class="dropdown-item"> Dropdown item </a>
      <a href="#" class="dropdown-item"> Other dropdown item </a>
      <a href="#" class="dropdown-item is-active"> Active dropdown item </a>
      <a href="#" class="dropdown-item"> Other dropdown item </a>
      <hr class="dropdown-divider">
      <a href="#" class="dropdown-item"> With a divider </a>
    </template>
  </VDropdown>
</template>
```

<!--/code-->

<!--example-->

<VField horizontal style="gap: 0.5rem;">
  <VControl>
    <VDropdown title="Modern rounded" class="is-rounded" rounded modern>
      <template #content>
        <a href="#" class="dropdown-item"> Dropdown item </a>
        <a href="#" class="dropdown-item"> Other dropdown item </a>
        <a href="#" class="dropdown-item is-active"> Active dropdown item </a>
        <a href="#" class="dropdown-item"> Other dropdown item </a>
        <hr class="dropdown-divider" />
        <a href="#" class="dropdown-item"> With a divider </a>
      </template>
    </VDropdown>
  </VControl>

  <VControl>
    <VDropdown title="Modern dropdown" modern up right>
      <template #content>
        <a href="#" class="dropdown-item"> Dropdown item </a>
        <a href="#" class="dropdown-item"> Other dropdown item </a>
        <a href="#" class="dropdown-item is-active"> Active dropdown item </a>
        <a href="#" class="dropdown-item"> Other dropdown item </a>
        <hr class="dropdown-divider" />
        <a href="#" class="dropdown-item"> With a divider </a>
      </template>
    </VDropdown>
  </VControl>
</VField>

<!--/example-->
