Validators: Zod schemas used to validate requests.

Keep schema definitions grouped by feature, e.g. `auth.validation.js`, `job.validation.js`.
Use a `validate` middleware to apply schemas to `body`, `query`, and `params`.
