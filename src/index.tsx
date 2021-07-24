import { requireNativeComponent, ViewStyle } from 'react-native';

type AdmobProps = {
  color: string;
  style: ViewStyle;
};

export const AdmobViewManager = requireNativeComponent<AdmobProps>(
'AdmobView'
);

export default AdmobViewManager;
