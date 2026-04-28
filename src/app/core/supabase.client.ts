import { createClient } from '@supabase/supabase-js';
import {environment} from '../../enviroments/env';

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseKey
);
