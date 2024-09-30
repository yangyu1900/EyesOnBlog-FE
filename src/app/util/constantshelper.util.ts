import { User } from '../model/user';

export const ROLES = ['author', 'reviewer'];
export const LINE_COLOR = '#4b779a';
export const VERTICAL_COLORS = ['#5a1c1d', '#b07320', '#196c55', '#173250'];
export const VERTICALS = ['config', 'dev', 'oss', 'perf'];

export const TEST_USER: User = {
    'userId': 935783,
    'userName': 'YangYu',
    'engineerName': 'Yang Yu',
    'email': 'yang.yu@microsoft.com',
    'podId': 0,
    'podName': 'Azure App Services Pod',
    'verticals': ['oss', 'perf'].join(),
    'roles': ['author', 'reviewer'].join(),
    'reviewCount': 1,
    'registerDate': new Date()
};