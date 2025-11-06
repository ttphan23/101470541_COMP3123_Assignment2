export const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

export const required = (v) => String(v ?? '').trim().length > 0;

export const positiveNumber = (v) =>
  v !== '' && !Number.isNaN(Number(v)) && Number(v) > 0;
