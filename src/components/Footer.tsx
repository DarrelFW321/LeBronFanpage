import { renderContent } from "@/app/resources";
import { Flex, IconButton, SmartLink, Text } from "@/once-ui/components"
import { useTranslations } from "next-intl";
import styles from './Footer.module.scss'

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const { person, social } = renderContent();

    return (
        <Flex
            as="footer"
            position="relative"
            fillWidth padding="8"
            justifyContent="center" mobileDirection="column">
            <Flex
                className={styles.mobile}
                fillWidth maxWidth="m" paddingY="8" paddingX="16" gap="16"
                justifyContent="space-between" alignItems="center">
                <Text
                    variant="body-default-s"
                    onBackground="neutral-strong">
                    <Text
                        onBackground="neutral-weak">
                        © {currentYear} /
                    </Text>
                    <Text paddingX="4">
                        Darrel Wihandi
                    </Text>
                    <Text onBackground="neutral-weak">
                        {/* Usage of this template requires attribution. Please don't remove the link to Once UI. */}
                        / Made with <SmartLink style={{marginLeft: '-0.125rem'}} href="https://once-ui.com/templates/magic-portfolio">Once UI</SmartLink>
                    </Text>
                </Text>
                <Flex
                    gap="16">
                    <IconButton
                        key="GitHub"
                        href="https://github.com/DarrelFW321"
                        icon="github"
                        tooltip="GitHub"
                        size="s"
                        variant="ghost"
                    />

                    <IconButton
                        key="Discord"
                        href="https://discord.com/users/pines5150"
                        icon="discord"
                        tooltip="Discord"
                        size="s"
                        variant="ghost"
                    />

                    <IconButton
                        key="Instagram"
                        href="https://www.instagram.com/darrel.feirow/"
                        icon="instagram"
                        tooltip="Instagram"
                        size="s"
                        variant="ghost"
                    />

                    <IconButton
                        key="Email"
                        href="mailto:darrel.wihandi@gmail.com/"
                        icon="email"
                        tooltip="Email"
                        size="s"
                        variant="ghost"
                    />
                </Flex>
            </Flex>
            <Flex height="80" show="s"></Flex>
        </Flex>
    )
}