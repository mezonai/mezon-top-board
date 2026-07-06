import { Modal, Form, Input, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useMezonAppControllerListAdminMezonAppQuery, useMezonAppControllerGetMyAppQuery } from '@app/services/api/mezonApp/mezonApp';
import { getAppTranslation } from '@app/hook/useAppTranslation';
import { Collection } from '@app/types/collection.types';
import { collectionSchema } from '@app/validations/collection.validation';
import MediaManagerModal from '@app/components/MediaManager/MediaManager';
import MtbButton from '@app/mtb-ui/Button';
import { EditOutlined } from '@ant-design/icons';
import TableImage from '@app/components/TableImage/TableImage';
import { CropImageShape } from '@app/enums/CropImage.enum';

interface CollectionFormValues {
    title: string;
    description?: string;
    featuredImage?: string;
    status: string;
    appIds?: string[];
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CollectionFormValues) => void;
    initialValues?: Collection | null;
    isLoading?: boolean;
    ownerId?: string;
}

const CollectionModal = ({ open, onClose, onSubmit, initialValues, isLoading, ownerId }: Props) => {
    const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);

    const baseParams = {
        pageNumber: 1,
        pageSize: 1000,
        sortField: 'name' as const,
        sortOrder: 'ASC' as const,
    };

    const { data: allAppsData } = useMezonAppControllerListAdminMezonAppQuery(baseParams, { skip: !!ownerId || !open });
    const { data: myAppsData } = useMezonAppControllerGetMyAppQuery(baseParams, { skip: !ownerId || !open });

    // Cast allAppsData because MezonAppControllerListAdminMezonAppApiResponse is typed as unknown
    const appsData = ownerId ? myAppsData : (allAppsData as typeof myAppsData);

    const appOptions = useMemo(() => {
        const apps = appsData?.data ?? [];
        return apps.map((app) => ({
            label: getAppTranslation(app, 'en').name,
            value: app.id,
        }));
    }, [appsData]);

    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(collectionSchema),
        defaultValues: {
            title: '',
            description: '',
            featuredImage: '',
            status: 'PRIVATE',
            appIds: [],
        },
    });

    const featuredImageValue = watch('featuredImage');

    useEffect(() => {
        if (!open) return;

        reset({
            title: initialValues?.title || '',
            description: initialValues?.description || '',
            featuredImage: initialValues?.featuredImage || '',
            status: initialValues?.status || 'PRIVATE',
            appIds: initialValues?.apps?.map(app => app.id) || [],
        });
    }, [open, initialValues, reset]);

    const onFormSubmit = (data: CollectionFormValues) => {
        onSubmit(data);
    };

    const handleMediaSelect = (path: string) => {
        setValue('featuredImage', path, { shouldValidate: true });
        setIsMediaManagerOpen(false);
    };

    return (
        <>
            <Modal
                title={initialValues ? 'Edit Collection' : 'Create Collection'}
                open={open}
                onCancel={onClose}
                zIndex={2}
                footer={[
                    <MtbButton key="cancel" variant="outlined" onClick={onClose}>Cancel</MtbButton>,
                    <MtbButton key="submit" loading={isLoading} onClick={handleSubmit(onFormSubmit)}>
                        {initialValues ? 'Update' : 'Create'}
                    </MtbButton>,
                ]}
                width={600}
                centered
            >
                <Form layout="vertical" className="pt-4">
                    <Form.Item label="Title" validateStatus={errors.title ? 'error' : ''} help={errors.title?.message}>
                        <Controller name="title" control={control} render={({ field }) => <Input {...field} placeholder="Collection title" />} />
                    </Form.Item>
                    <Form.Item label="Description">
                        <Controller name="description" control={control} render={({ field }) => <Input.TextArea {...field} rows={3} placeholder="Optional description" />} />
                    </Form.Item>
                    <Form.Item label="Featured Image">
                        <div className="flex items-center gap-4">
                            <TableImage src={featuredImageValue} alt="featured" size={60} />
                            <MtbButton icon={<EditOutlined />} variant="outlined" onClick={() => setIsMediaManagerOpen(true)}>
                                Choose Image
                            </MtbButton>
                        </div>
                    </Form.Item>
                    <Form.Item label="Status">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select {...field}>
                                    <Select.Option value="PRIVATE">Private</Select.Option>
                                    <Select.Option value="PUBLISHED">Published</Select.Option>
                                </Select>
                            )}
                        />
                    </Form.Item>
                    <Form.Item label="Apps">
                        <Controller
                            name="appIds"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    mode="multiple"
                                    showSearch
                                    placeholder="Search and select apps"
                                    optionFilterProp="label"
                                    onChange={(val) => field.onChange(val)}
                                    value={field.value}
                                    options={appOptions}
                                    allowClear
                                />
                            )}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <MediaManagerModal
                isVisible={isMediaManagerOpen}
                onChoose={handleMediaSelect}
                onClose={() => setIsMediaManagerOpen(false)}
                initialCropShape={CropImageShape.RECTANGLE}
                showShapeSwitcher={true}
            />
        </>
    );
};

export default CollectionModal;
