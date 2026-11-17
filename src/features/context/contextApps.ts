import { wheelProfiles } from '../wheel/wheelProfiles'

// Те же условные действия, что и в Hero; выбранный профиль хранится отдельно.
export const contextApps = wheelProfiles.filter((profile) => profile.id !== 'windows')
export type ContextAppId = (typeof contextApps)[number]['id']
