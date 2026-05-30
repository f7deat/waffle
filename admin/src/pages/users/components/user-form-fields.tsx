import { Col, Row } from 'antd';
import { ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components';

const genderOptions = [
  {
    label: 'Nam',
    value: false,
  },
  {
    label: 'Nữ',
    value: true,
  },
];

type UserFormFieldsProps = {
  includeId?: boolean;
  includeUserName?: boolean;
  includeEmail?: boolean;
  includePhoneNumber?: boolean;
  includeGender?: boolean;
  includeDateOfBirth?: boolean;
  includeAddress?: boolean;
  includePassword?: boolean;
};

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  includeId = false,
  includeUserName = true,
  includeEmail = true,
  includePhoneNumber = true,
  includeGender = true,
  includeDateOfBirth = false,
  includeAddress = false,
  includePassword = false,
}) => (
  <>
    {includeId && <ProFormText name="id" hidden />}
    <Row gutter={16}>
      <Col md={12} xs={24}>
        <ProFormText
          name="name"
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        />
      </Col>
      {includeUserName && (
        <Col md={12} xs={24}>
          <ProFormText
            name="userName"
            label="User Name"
            rules={[
              {
                required: true,
              },
            ]}
          />
        </Col>
      )}
      {includeDateOfBirth && (
        <Col md={8} xs={24}>
          <ProFormDatePicker name="dateOfBirth" label="Ngày sinh" />
        </Col>
      )}
      {includeGender && (
        <Col md={includeDateOfBirth ? 8 : 4} xs={24}>
          <ProFormSelect name="gender" label="Gender" options={genderOptions} />
        </Col>
      )}
      {includeEmail && (
        <Col md={10} xs={24}>
          <ProFormText name="email" label="Email" />
        </Col>
      )}
      {includePhoneNumber && (
        <Col md={10} xs={24}>
          <ProFormText name="phoneNumber" label="Phone Number" />
        </Col>
      )}
      {includeAddress && (
        <Col md={24} xs={24}>
          <ProFormText name="address" label="Địa chỉ" />
        </Col>
      )}
      {includePassword && (
        <>
          <Col md={12} xs={24}>
            <ProFormText.Password
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                },
              ]}
            />
          </Col>
          <Col md={12} xs={24}>
            <ProFormText.Password
              name="confirmPassword"
              label="Confirm password"
              rules={[
                {
                  required: true,
                },
              ]}
            />
          </Col>
        </>
      )}
    </Row>
  </>
);

export default UserFormFields;
