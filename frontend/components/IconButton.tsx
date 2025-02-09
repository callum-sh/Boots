import React from 'react';
import { Button, StyleSheet, TouchableOpacity } from "react-native";
import { Text, useThemeColor } from "./Themed";
import EvilIcons from '@expo/vector-icons/EvilIcons';


type ThemeProps = {
    iconName: string;
    iconSize: number;
    content?: string;
    lightColor?: string;
    darkColor?: string;
};

export type ButtonProps = ThemeProps & Button['props'];


export function IconButton(props: any) {
    const { onPress, iconName, iconSize, lightColor, darkColor, content, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor }]} {...otherProps}>
            <EvilIcons name={iconName} size={iconSize} color={props.color} />
            {content && <Text style={{ color: props.color }}>{content}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
});