<script setup lang="ts">
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Radio } from '@/components/ui/radio';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Heading, Text, Link as TypographyLink } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '@/components/ui/modal';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import { Tooltip } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

const showModal = ref(false);
const inputValue = ref('');
const textareaValue = ref('');
const selectValue = ref('');
const checkboxValue = ref(false);
const radioValue = ref('option1');
const switchValue = ref(false);

const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: 'Components', href: '/components' },
];

const paginationLinks = [
    { url: null, label: '&laquo; Previous', active: false },
    { url: '/?page=1', label: '1', active: true },
    { url: '/?page=2', label: '2', active: false },
    { url: '/?page=3', label: '3', active: false },
    { url: '/?page=2', label: 'Next &raquo;', active: false },
];
</script>

<template>
    <Head title="Component Library" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-12">
            <div>
                <Heading level="h1">Component Library</Heading>
                <Text class="mt-2" muted>
                    Eine umfassende Sammlung von UI-Komponenten mit Tailwind CSS
                </Text>
            </div>

            <!-- Buttons -->
            <section>
                <Heading level="h2">Buttons</Heading>
                <div class="mt-4 flex flex-wrap gap-4">
                    <Button>Default</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="link">Link</Button>
                </div>
                <div class="mt-4 flex flex-wrap gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                </div>
            </section>

            <!-- Forms -->
            <section>
                <Heading level="h2">Forms</Heading>
                <div class="mt-4 space-y-6 max-w-md">
                    <div>
                        <Label for="input-demo">Input</Label>
                        <Input id="input-demo" v-model="inputValue" placeholder="Enter text..." class="mt-2" />
                    </div>
                    <div>
                        <Label for="textarea-demo">Textarea</Label>
                        <Textarea id="textarea-demo" v-model="textareaValue" placeholder="Enter text..." class="mt-2" />
                    </div>
                    <div>
                        <Label for="select-demo">Select</Label>
                        <Select id="select-demo" v-model="selectValue" class="mt-2">
                            <option value="">Choose...</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                        </Select>
                    </div>
                    <div class="flex items-center gap-2">
                        <Checkbox id="checkbox-demo" v-model="checkboxValue" />
                        <Label for="checkbox-demo">Checkbox</Label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Radio id="radio1" v-model="radioValue" value="option1" />
                        <Label for="radio1">Option 1</Label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Radio id="radio2" v-model="radioValue" value="option2" />
                        <Label for="radio2">Option 2</Label>
                    </div>
                    <div class="flex items-center gap-2">
                        <Switch id="switch-demo" v-model="switchValue" />
                        <Label for="switch-demo">Switch</Label>
                    </div>
                </div>
            </section>

            <!-- Badges -->
            <section>
                <Heading level="h2">Badges</Heading>
                <div class="mt-4 flex flex-wrap gap-4">
                    <Badge>Default</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                </div>
            </section>

            <!-- Cards -->
            <section>
                <Heading level="h2">Cards</Heading>
                <div class="mt-4 grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Text>Card content goes here.</Text>
                        </CardContent>
                        <CardFooter>
                            <Button>Action</Button>
                        </CardFooter>
                    </Card>
                    <Card hover>
                        <CardHeader>
                            <CardTitle>Hover Card</CardTitle>
                            <CardDescription>This card has hover effect</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Text>Hover over this card to see the effect.</Text>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <!-- Alerts -->
            <section>
                <Heading level="h2">Alerts</Heading>
                <div class="mt-4 space-y-4 max-w-2xl">
                    <Alert variant="info">
                        <AlertTitle>Info</AlertTitle>
                        <AlertDescription>This is an info alert.</AlertDescription>
                    </Alert>
                    <Alert variant="success">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>This is a success alert.</AlertDescription>
                    </Alert>
                    <Alert variant="warning">
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>This is a warning alert.</AlertDescription>
                    </Alert>
                    <Alert variant="error">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>This is an error alert.</AlertDescription>
                    </Alert>
                </div>
            </section>

            <!-- Typography -->
            <section>
                <Heading level="h2">Typography</Heading>
                <div class="mt-4 space-y-4">
                    <Heading level="h1">Heading 1</Heading>
                    <Heading level="h2">Heading 2</Heading>
                    <Heading level="h3">Heading 3</Heading>
                    <Text>This is a paragraph.</Text>
                    <Text variant="small" muted>This is small muted text.</Text>
                    <TypographyLink href="#">This is a link</TypographyLink>
                </div>
            </section>

            <!-- Table -->
            <section>
                <Heading level="h2">Table</Heading>
                <div class="mt-4">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell><Badge variant="success">Active</Badge></TableCell>
                                    <TableCell>Admin</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Jane Smith</TableCell>
                                    <TableCell><Badge variant="info">Pending</Badge></TableCell>
                                    <TableCell>User</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </section>

            <!-- Pagination -->
            <section>
                <Heading level="h2">Pagination</Heading>
                <div class="mt-4">
                    <Pagination :links="paginationLinks" @navigate="(url) => console.log(url)" />
                </div>
            </section>

            <!-- Modal -->
            <section>
                <Heading level="h2">Modal</Heading>
                <div class="mt-4">
                    <Button @click="showModal = true">Modal öffnen</Button>
                    <Modal v-model="showModal" size="md">
                        <ModalHeader @close="showModal = false">
                            <CardTitle>Modal Titel</CardTitle>
                        </ModalHeader>
                        <ModalContent>
                            <Text>Dies ist Modal-Inhalt.</Text>
                        </ModalContent>
                        <ModalFooter>
                            <Button variant="outline" @click="showModal = false">Abbrechen</Button>
                            <Button @click="showModal = false">Bestätigen</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </section>

            <!-- Dropdown -->
            <section>
                <Heading level="h2">Dropdown</Heading>
                <div class="mt-4">
                    <Dropdown>
                        <template #trigger="{ isOpen }">
                            <Button variant="outline">Dropdown Menu</Button>
                        </template>
                        <DropdownItem>Profile</DropdownItem>
                        <DropdownItem>Settings</DropdownItem>
                        <DropdownItem>Logout</DropdownItem>
                    </Dropdown>
                </div>
            </section>

            <!-- Tooltip -->
            <section>
                <Heading level="h2">Tooltip</Heading>
                <div class="mt-4">
                    <Tooltip position="top">
                        <Button>Hover me</Button>
                        <template #content>This is a tooltip</template>
                    </Tooltip>
                </div>
            </section>

            <!-- Tabs -->
            <section>
                <Heading level="h2">Tabs</Heading>
                <div class="mt-4">
                    <Tabs default-tab="tab1">
                        <TabsList>
                            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                        </TabsList>
                        <TabsContent value="tab1">
                            <Card class="mt-4">
                                <CardContent class="pt-6">
                                    <Text>Content for Tab 1</Text>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="tab2">
                            <Card class="mt-4">
                                <CardContent class="pt-6">
                                    <Text>Content for Tab 2</Text>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="tab3">
                            <Card class="mt-4">
                                <CardContent class="pt-6">
                                    <Text>Content for Tab 3</Text>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            <!-- Avatar -->
            <section>
                <Heading level="h2">Avatar</Heading>
                <div class="mt-4 flex items-center gap-4">
                    <Avatar name="John Doe" size="sm" />
                    <Avatar name="Jane Smith" size="md" />
                    <Avatar name="Bob Johnson" size="lg" />
                </div>
            </section>

            <!-- Breadcrumb -->
            <section>
                <Heading level="h2">Breadcrumb</Heading>
                <div class="mt-4">
                    <Breadcrumb :items="breadcrumbs" />
                </div>
            </section>

            <!-- Separator -->
            <section>
                <Heading level="h2">Separator</Heading>
                <div class="mt-4 space-y-4">
                    <Text>Above</Text>
                    <Separator />
                    <Text>Below</Text>
                </div>
            </section>

            <!-- Skeleton -->
            <section>
                <Heading level="h2">Skeleton</Heading>
                <div class="mt-4 space-y-4">
                    <Skeleton class="h-4 w-full" />
                    <Skeleton class="h-4 w-3/4" />
                    <Skeleton variant="circular" class="h-12 w-12" />
                </div>
            </section>

            <!-- Spinner -->
            <section>
                <Heading level="h2">Spinner</Heading>
                <div class="mt-4 flex items-center gap-4">
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                </div>
            </section>
        </div>
    </AppLayout>
</template>
