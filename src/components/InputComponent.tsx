import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {ReactNode, useState} from 'react';

interface Props {
  value?: string;
  placeholder?: string;
  onChange: (val: string) => void;
  onEnd?: () => void;
  type?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  preFix?: ReactNode;
}

const InputComponent = (props: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isShowPass, setIsShowPass] = useState(false);
  const {value, placeholder, onChange, onEnd, type, secureTextEntry, preFix} =
    props;

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const isSecureTextEntry = secureTextEntry && type === 'default';
  return (
    <View
      style={[
        styles.rowCenter,
        styles.inputContainer,
        isFocused && styles.inputFocused,
      ]}>
      {preFix && preFix}
      <TextInput
        keyboardType={type}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={'#A6A6A6'}
        onChangeText={val => onChange(val)}
        style={[styles.input, {paddingLeft: preFix ? 4 : 0}]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={isSecureTextEntry && !isShowPass}
        autoCapitalize="none"
      />
      {isSecureTextEntry && (
        <TouchableOpacity onPress={() => setIsShowPass(!isShowPass)}>
          <Feather
            name={!isShowPass ? 'eye-off' : 'eye'}
            size={18}
            color={'#A6A6A6'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rowCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputFocused: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderColor: '#A2CFFF',
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f3f5f6',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#afb0b3',
  },
  input: {
    flex: 1,
    margin: 0,
    padding: 0,
    fontSize: 14,
    color: '#212121',
  },
});
export default InputComponent;
