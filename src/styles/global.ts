import {StyleSheet} from 'react-native';
import fonts from './fonts';
import colors from './colors';

export const globalStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    color: '#212121',
    fontFamily: fonts.regular,
  },
  input: {
    flex: 1,
    margin: 0,
    padding: 0,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  inputFocused: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderColor: colors.blue2,
    backgroundColor: colors.white,
  },
  inputContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: colors.gray1,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.gray5,
  },
  rowCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  section: {
    paddingBottom: 16,
  },
  button: {
    height: 40,
    backgroundColor: colors.red,
    borderRadius: 100,
  },
});
