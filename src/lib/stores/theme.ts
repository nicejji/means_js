import { browser } from "$app/environment";
import { writable } from "svelte/store";

type ThemeData = {
  auto: boolean;
  systemDark: boolean;
  manualDark: boolean;
};

const query = browser ? matchMedia('(prefers-color-scheme: dark)') : null;
const defaultValue: ThemeData = { auto: false, systemDark: false, manualDark: false };
const storageValue: ThemeData | null =
  browser ? JSON.parse(localStorage.getItem('themeData') ?? JSON.stringify(defaultValue)) : null;
const initialValue = storageValue ?? defaultValue;
initialValue.systemDark = query?.matches ?? initialValue.systemDark;

const themeStore = writable<ThemeData>(initialValue);

themeStore.subscribe(themeData => {
  if (browser) localStorage.setItem('themeData', JSON.stringify(themeData));
})

query?.addEventListener("change", ({ matches }) => {
  themeStore.update(themeData => {
    return { ...themeData, systemDark: matches };
  })
})

export default themeStore;
