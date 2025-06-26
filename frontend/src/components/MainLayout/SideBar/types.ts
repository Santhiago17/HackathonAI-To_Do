import type { NavButtonsProps } from "../NavButtons/types"
import type { UserProfileProps } from "../UserProfile/types"

export type SideBarProps = UserProfileProps &
  NavButtonsProps & {
    buttonText: string
    onButtonClick: () => void
  }
