import { createClient } from '@supabase/supabase-js';
import {environment} from '../../environments/env';

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseKey
);
