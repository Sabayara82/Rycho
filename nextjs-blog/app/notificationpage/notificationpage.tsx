import { SetStateAction } from "react";
import {handleStateChange} from './NotificationDsiplay'
export function updateNotificationState( newValue: boolean) {
    handleStateChange(newValue)
}