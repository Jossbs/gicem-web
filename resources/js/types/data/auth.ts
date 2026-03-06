import { App } from '@/wayfinder/types';
import User = App.Models.Client.User;

export type Permissions = {
    'students.create': boolean;
    'students.edit': boolean;
    'students.delete': boolean;
    'groups.access': boolean;
    'groups.manage': boolean;
    'staff.access': boolean;
    'guardians.edit': boolean;
    'guardians.create-account': boolean;
};

export type Auth = {
    user: User;
    can: Permissions;
};
